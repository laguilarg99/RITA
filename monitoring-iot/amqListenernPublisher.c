#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include <jansson.h>
#include <time.h>	
#include <amqp.h>
#include <amqp_tcp_socket.h>

#define JSON_BUFFER_SIZE 256
#define NANO_PER_SECOND		1000000000L
#define MICRO_PER_SECOND	1000000L
#define MILLIS_PER_SECOND	1000L
#define MILLIS_PER_NANO		1e-6
#define checkResults(string, val) {             \
 if (val) {                                     \
   printf("Failed with %d at %s", val, string); \
   exit(1);                                     \
 }                                              \
}

typedef struct {
    char *id;
    char *name;
    char *status;
    int period;
    int cpuTime;
    int maxResponseTime;
    int portNumber;
    char *portType;
    char *sensorId;
    char *deviceId;
} Task;

//Estructura de dato que almacena la informacion de la tarea periodica
typedef struct {
	//Datos generales del thread
	int no_thread;				//numero de hilo
	struct timespec periodo;	//Periodo - T
	struct timespec fase;  		//1a activacion - fase phi - fija instante critico
	struct timespec computo;	//tiempo de computo - C
	struct timespec deadline;	//plazo de respuesta maxima
	int prioridad;				//prioridad de la tarea

	//Estado del thread
	long num_activaciones;		//numero de activaciones realizadas por la tarea
	int isActive;				//!=0 significa que esta activo

	//Estadisticas
	struct timespec tiempo_comienzo;  //Marca de inicio del tiempo
	struct timespec tiempo_fin;		//Marca de fin del tiempo

    //rabbitmq
    amqp_connection_state_t conn;
    char *taskId;
    int portId;
} tipo_periodic;

/****************************************************************
*
*	Definicion de funciones y manejadores de hebras
*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++******/

void* periodic(void* arg);

//operaciones de tiempo
struct timespec timeSum(struct timespec* t1, struct timespec* t2);
struct timespec timeDif(struct timespec* t1, struct timespec* t2);
struct timespec millis2timespec(double tiempoMillis);
double timespec2millis(struct timespec* t1);

//operaciones sobre threads
void inicializaThread(pthread_t* tid, tipo_periodic* info);
void finalizaThread(pthread_t* tid, tipo_periodic* info);

//lectura de los sensores
void read_sensor_n_publish_metrics(tipo_periodic* datos);

char* createMetricJsonString(const char* taskId, int value, const char* name, int position) {
    char* json = (char*)malloc(JSON_BUFFER_SIZE * sizeof(char));
    if (!json) {
        fprintf(stderr, "Memory allocation failed.\n");
        return NULL;
    }

    snprintf(json, JSON_BUFFER_SIZE, "{\"taskId\":\"%s\",\"value\":%d,\"name\":\"%s\",\"position\":%d}",
             taskId, value, name, position);

    return json;
}

char* createTaskStatusJsonString(const char* taskId, const char* status) {
    char* json = (char*)malloc(JSON_BUFFER_SIZE * sizeof(char));
    if (!json) {
        fprintf(stderr, "Memory allocation failed.\n");
        return NULL;
    }

    snprintf(json, JSON_BUFFER_SIZE, "{\"taskId\":\"%s\",\"status\":\"%s\"}", taskId, status);

    return json;
}

Task *parse_task_json(const char *json_string) {
    json_error_t error;
    json_t *root = json_loads(json_string, 0, &error);
    if (!root) {
        fprintf(stderr, "Error parsing JSON: %s\n", error.text);
        return NULL;
    }

    Task *task = malloc(sizeof(Task));
    if (!task) {
        fprintf(stderr, "Memory allocation error\n");
        json_decref(root);
        return NULL;
    }

    json_t *id = json_object_get(root, "id");
    json_t *name = json_object_get(root, "name");
    json_t *status = json_object_get(root, "status");
    json_t *period = json_object_get(root, "period");
    json_t *cpuTime = json_object_get(root, "cpuTime");
    json_t *maxResponseTime = json_object_get(root, "maxResponseTime");
    json_t *portNumber = json_object_get(root, "portNumber");
    json_t *portType = json_object_get(root, "portType");
    json_t *sensorId = json_object_get(root, "sensorId");
    json_t *deviceId = json_object_get(root, "deviceId");

    task->id = strdup(json_string_value(id));
    task->name = strdup(json_string_value(name));
    task->status = strdup(json_string_value(status));
    task->period = json_integer_value(period);
    task->cpuTime = json_integer_value(cpuTime);
    task->maxResponseTime = json_integer_value(maxResponseTime);
    task->portNumber = json_integer_value(portNumber);
    task->portType = strdup(json_string_value(portType));
    task->sensorId = strdup(json_string_value(sensorId));
    task->deviceId = strdup(json_string_value(deviceId));

    json_decref(root);
    return task;
}

void die_on_error(int x, char const *context) {
    if (x < 0) {
        fprintf(stderr, "%s: %s\n", context, amqp_error_string2(x));
        exit(1);
    }
}

void die_on_amqp_error(amqp_rpc_reply_t x, char const *context) {
    switch (x.reply_type) {
        case AMQP_RESPONSE_NORMAL:
            return;
        case AMQP_RESPONSE_NONE:
            fprintf(stderr, "%s: missing RPC reply type!\n", context);
            break;
        case AMQP_RESPONSE_LIBRARY_EXCEPTION:
            fprintf(stderr, "%s: %s\n", context, amqp_error_string2(x.library_error));
            break;
        case AMQP_RESPONSE_SERVER_EXCEPTION:
            switch (x.reply.id) {
                case AMQP_CONNECTION_CLOSE_METHOD: {
                    amqp_connection_close_t *m = (amqp_connection_close_t *) x.reply.decoded;
                    fprintf(stderr, "%s: server connection error %uh, message: %.*s\n",
                            context,
                            m->reply_code,
                            (int) m->reply_text.len, (char *) m->reply_text.bytes);
                    break;
                }
                case AMQP_CHANNEL_CLOSE_METHOD: {
                    amqp_channel_close_t *m = (amqp_channel_close_t *) x.reply.decoded;
                    fprintf(stderr, "%s: server channel error %uh, message: %.*s\n",
                            context,
                            m->reply_code,
                            (int) m->reply_text.len, (char *) m->reply_text.bytes);
                    break;
                }
                default:
                    fprintf(stderr, "%s: unknown server error, method id 0x%08X\n", context, x.reply.id);
                    break;
            }
            break;
    }
    exit(1);
}

void publish_message(amqp_connection_state_t conn, char const *queue_name, char const *message) {
    amqp_basic_properties_t props;
    props._flags = AMQP_BASIC_CONTENT_TYPE_FLAG | AMQP_BASIC_DELIVERY_MODE_FLAG;
    props.content_type = amqp_cstring_bytes("text/plain");
    props.delivery_mode = 2; // Persistent delivery mode

    die_on_error(
        amqp_basic_publish(
            conn,
            1,
            amqp_cstring_bytes(""),
            amqp_cstring_bytes(queue_name),
            0,
            0,
            &props,
            amqp_cstring_bytes(message)),
        "Publishing"
    );

    printf("Published message to queue '%s': %s\n", queue_name, message);
}


void *publisher_n_listener_thread(void *arg) {
    char const *hostname = "localhost";
    int port = 5672;

    amqp_connection_state_t conn;
    amqp_socket_t *socket = NULL;
    amqp_rpc_reply_t reply;
    amqp_envelope_t envelope;

    const char *my_device_id = getenv("DEVICE_ID");
    if (my_device_id == NULL) {
        fprintf(stderr, "Error: DEVICE_ID environment variable not set\n");
        return NULL;
    }

    // Establish a connection to the RabbitMQ server
    conn = amqp_new_connection();
    socket = amqp_tcp_socket_new(conn);
    if (!socket) {
        die_on_error(-1, "creating TCP socket");
    }

    die_on_error(amqp_socket_open(socket, hostname, port), "opening TCP socket");
    die_on_amqp_error(amqp_login(conn, "/", 0, 131072, 0, AMQP_SASL_METHOD_PLAIN, "guest", "guest"), "Logging in");

    // Open a channel
    amqp_channel_open(conn, 1);
    die_on_amqp_error(amqp_get_rpc_reply(conn), "Opening channel");

    // Declare the queue to ensure it exists
    amqp_queue_declare(conn, 1, amqp_cstring_bytes("TASKS"), 0, 0, 0, 0, amqp_empty_table);
    die_on_amqp_error(amqp_get_rpc_reply(conn), "Declaring queue");

    amqp_queue_declare(conn, 1, amqp_cstring_bytes("METRICS"), 0, 0, 0, 0, amqp_empty_table);
    die_on_amqp_error(amqp_get_rpc_reply(conn), "Declaring metrics queue");

    amqp_queue_declare(conn, 1, amqp_cstring_bytes("STATUS"), 0, 0, 0, 0, amqp_empty_table);
    die_on_amqp_error(amqp_get_rpc_reply(conn), "Declaring status queue");

    // Set up consumer
    amqp_basic_consume(conn, 1, amqp_cstring_bytes("TASKS"), amqp_empty_bytes, 0, 1, 0, amqp_empty_table);
    die_on_amqp_error(amqp_get_rpc_reply(conn), "Consuming");

    printf("Waiting for messages...\n");

    while (1) {
        amqp_maybe_release_buffers(conn);
        reply = amqp_consume_message(conn, &envelope, NULL, 0);

        if (AMQP_RESPONSE_NORMAL != reply.reply_type) {
            break;
        }

        printf("Provided TASK: %.*s\n", (int) envelope.message.body.len, (char *) envelope.message.body.bytes);

        Task *task = parse_task_json((char *) envelope.message.body.bytes);
        if (!task) {
            return NULL;
        }

        if (strcmp(task->deviceId, my_device_id) != 0) {

            printf("Task Device ID: %s\n", task->deviceId);
            printf("My Device ID: %s\n", my_device_id);
                        
            publish_message(conn, "TASKS", (char *) envelope.message.body.bytes);

            free(task->id);
            free(task->name);
            free(task->status);
            free(task->portType);
            free(task->sensorId);
            free(task->deviceId);
            free(task);

            sleep(3);

            continue;            
        }

        //Prepara los parametros del thread
        tipo_periodic infothread;

        infothread.periodo = millis2timespec(task->period);
        infothread.computo = millis2timespec(task->cpuTime); 
        infothread.deadline = millis2timespec(task->maxResponseTime);
        infothread.fase = millis2timespec(0.);
        infothread.prioridad = 30;
        infothread.conn = conn;
        infothread.portId = task->portNumber;
        
        // Allocate memory for infothread.taskId and copy the string
        infothread.taskId = malloc(strlen(task->id) + 1);
        if (infothread.taskId == NULL) {
            // Handle allocation failure
            fprintf(stderr, "Memory allocation failed\n");
            exit(1);
        }
        strcpy(infothread.taskId, task->id); // Copy the string value

        // Free allocated memory
        free(task->id);
        free(task->name);
        free(task->status);
        free(task->portType);
        free(task->sensorId);
        free(task->deviceId);
        free(task);

        publish_message(conn, "STATUS", createTaskStatusJsonString(infothread.taskId, "ACTIVE"));

        //crea la hebra
        pthread_t thread;
        inicializaThread(&thread, &infothread);

        printf("hebra creada\n");

        sleep(10);

        finalizaThread(&thread, &infothread);

	    printf("hebra finalizada\n");

        publish_message(conn, "STATUS", createTaskStatusJsonString(infothread.taskId, "INACTIVE"));

        amqp_destroy_envelope(&envelope);

     
    }

    // Clean up
    die_on_amqp_error(amqp_channel_close(conn, 1, AMQP_REPLY_SUCCESS), "Closing channel");
    die_on_amqp_error(amqp_connection_close(conn, AMQP_REPLY_SUCCESS), "Closing connection");
    die_on_error(amqp_destroy_connection(conn), "Ending connection");

    return NULL;
}

/////////////////////////////////////////////////////////////////////////////
// Funcion periodic: Se crea la tarea periodica con retardos
// Param1: (IN) Puntero a void con la estructura o variable que se pasa al manejador
// Return: Devuelve el estado de error si es distinto de cero
/////////////////////////////////////////////////////////////////////////////
void* periodic(void* arg)
{
	//Estructuras relacionadas con el tiempo y el temporizador
	struct timespec retardo;
	struct timespec periodo;
	struct timespec start_time;      //Comienzo
	struct timespec stop_time;       //Final
	struct timespec timeInterval;
	double tiempo;

	//Variables auxiliares
	int activation_count;

	//Estructura que contiene los datos que se pasan al hilo peri�dico 
	tipo_periodic* datos = (tipo_periodic*) arg;

	//Establece el tiempo de retardo
	periodo = datos->periodo;

	//prepara las variables auxiliares
	activation_count = 0;

	//Capturar la marca de inicio el tiempo con un reloj independiente 
	clock_gettime(CLOCK_MONOTONIC, &start_time);
	retardo = timeSum(&start_time, &(datos->fase)); //El primer nanosleep espera a la fase

	printf("inicia hebra\n");

	//Bucle con las iteraciones periodicas
	while (datos->isActive) {
		//se suspende el thread en curso hasta
		clock_nanosleep(CLOCK_MONOTONIC,TIMER_ABSTIME,&retardo, NULL);
		retardo = timeSum(&retardo, &periodo);  //fija la siguiente activacion
		activation_count++;

		//Arranque de la tarea 
		clock_gettime(CLOCK_MONOTONIC, &stop_time);
		timeInterval = timeDif(&stop_time, &start_time);
		tiempo = timespec2millis(&timeInterval);
		printf("Tiempo: %.6f \n", tiempo);

        read_sensor_n_publish_metrics(datos);
       
		//Codigo de la tarea periodica
		printf("he ejecutado hebra %d veces\n",activation_count);

	}

	//Para el tiempo 
	clock_gettime(CLOCK_MONOTONIC, &stop_time);

	//Calcula el tiempo total transcurrido
	timeInterval = timeDif(&stop_time, &start_time);

	tiempo=timespec2millis(&timeInterval);

	printf("Total: %.6f \n", tiempo);


	return 0;
}

/////////////////////////////////////////////////////////////////////////
// Funcion read_metrics: Lee los datos de un sensor y los publica
////////////////////////////////////////////////////////////////////////
void read_sensor_n_publish_metrics(tipo_periodic* datos) {
   int temperature = rand() % 101; // Generate a random number between 0-100
   publish_message(datos->conn, "METRICS", createMetricJsonString(datos->taskId, temperature, "t", 1));
}

/////////////////////////////////////////////////////////////////////////
// Funcion timeDifference: Obtiene la suma entre dos instantes de
//			tiempo expresado en timespec t1 - t1
// Param1: (IN) Instante de tiempo t1
// Param2: (IN) Instante de tiempo t2
// Return: Estructura timespec suma
////////////////////////////////////////////////////////////////////////
struct timespec timeDif(struct timespec* t1, struct timespec* t2)
{
	struct timespec tres;

	tres.tv_sec = t1->tv_sec - t2->tv_sec;
	tres.tv_nsec = t1->tv_nsec - t2->tv_nsec;
	if (tres.tv_nsec < 0) {
		tres.tv_nsec += NANO_PER_SECOND;
		tres.tv_sec--;
	}
	return tres;
}

/////////////////////////////////////////////////////////////////////////
// Funcion timeSum: Obtiene la suma entre dos instantes de
//			tiempo expresado en timespec t1 + t1
// Param1: (IN) Instante de tiempo t1
// Param2: (IN) Instante de tiempo t2
// Return: Estructura timespec suma
////////////////////////////////////////////////////////////////////////
struct timespec timeSum(struct timespec* t1, struct timespec* t2)
{
	struct timespec tres;

	tres.tv_sec = t1->tv_sec + t2->tv_sec;
	tres.tv_nsec = t1->tv_nsec + t2->tv_nsec;
	if (tres.tv_nsec >= NANO_PER_SECOND) {
		tres.tv_nsec -= NANO_PER_SECOND;
		tres.tv_sec++;
	}
	return tres;
}

/////////////////////////////////////////////////////////////////////////
// Funcion millis2timespec: convierte milisegundos en tiempo en timespec
// Param1: (IN) tiempoMillis
// Return: Estructura timespec suma
////////////////////////////////////////////////////////////////////////
struct timespec millis2timespec(double tiempoMillis)
{
	struct timespec result;
	double cociente, resto;
	cociente = tiempoMillis / MILLIS_PER_SECOND;
	result.tv_sec = (long)cociente;
	resto = cociente - result.tv_sec;
	result.tv_nsec = (long)((long)(resto * NANO_PER_SECOND));
	return result;
}


/////////////////////////////////////////////////////////////////////////
// Funcion timespec2millis: Obtiene el numero de millisegundos a partir de un
//			un intervalo de tiempo expresado en timespec
// Param1: (IN) Intervalo de tiempo en estructura timespec
// Return: Millisegundos asociados al intervalo de tiempo
////////////////////////////////////////////////////////////////////////
double timespec2millis(struct timespec* t1)
{
	double delta;
	delta = (double)t1->tv_sec * (double)MILLIS_PER_SECOND;
	delta += (double)t1->tv_nsec * (double)MILLIS_PER_NANO;
	return delta;
}


/////////////////////////////////////////////////////////////////////////
// Funcion inicializaThread: Configura y arranca el thread
// Param1: (IN/OUT) tid
// Param2: (IN) info
// Return: no devuelve nada
////////////////////////////////////////////////////////////////////////
void inicializaThread(pthread_t* tid, tipo_periodic* info)
{
	//definicion de parametros
	pthread_attr_t attr;
	struct sched_param param;
	int rc = 0;

	//Actualiza el estado de la info del thread
	info->num_activaciones = 0;
	info->isActive = 1;

	//inicializa las propiedades del thread
	rc = pthread_attr_init(&attr);

	//Establece propiedades del thread
	//checkResults("pthread_attr_init()\n", rc);
	rc = pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
	pthread_attr_setinheritsched(&attr, PTHREAD_EXPLICIT_SCHED);
	//pthread_attr_setscope(&Attr, PTHREAD_SCOPE_PROCESS);
	pthread_attr_setschedpolicy(&attr, SCHED_FIFO);
	pthread_attr_getschedparam(&attr, &param);
	param.sched_priority = info->prioridad;
	pthread_attr_setschedparam(&attr, &param);

	//Crea la hebra
	rc = pthread_create(tid, &attr, periodic, info);
	checkResults("pthread_create()\n", rc);

	//destruye el atributo
	rc = pthread_attr_destroy(&attr);
	//checkResults("pthread_attr_destroy()\n", rc);

}


/////////////////////////////////////////////////////////////////////////
// Funcion finalizaThread: finaliza el thread haciendo un join
// Param1: (IN) tid
// Param2: (IN) info
// Return: no devuelve nada
////////////////////////////////////////////////////////////////////////
void finalizaThread(pthread_t* tid, tipo_periodic* info)
{
	//definicion de parametros
	int rc = 0;

	//Finaliza el hilo desactivando el flag de activo
	info->isActive = 0;

	//Finaliza la hebra
	rc = pthread_join(*tid, NULL);
	//checkResults("pthread_join()\n", rc);
}

int main(void) {
    pthread_t publisher_n_listener_tid;

	pthread_attr_t attr;
	struct sched_param param;

	struct timespec start_time;      //Comienzo
	struct timespec stop_time;       //Final

    //Marca el arranque
	clock_gettime(CLOCK_MONOTONIC, &start_time);
 
	//inicializa las propiedades del thread
	pthread_attr_init(&attr);
	pthread_attr_getschedparam(&attr, &param);
	param.sched_priority = 1;
	pthread_attr_setschedparam(&attr, &param);

    // Create the publisher thread
    if (pthread_create(&publisher_n_listener_tid, &attr, publisher_n_listener_thread, NULL)) {
        fprintf(stderr, "Error creating publisher thread\n");
        return 1;
    }

	//destruye el atributo
	pthread_attr_destroy(&attr);
    
    if (pthread_join(publisher_n_listener_tid, NULL)) {
        fprintf(stderr, "Error joining publisher thread\n");
        return 1;
    }

	printf("Hilo principal: Termina programa\n");

    return 0;
}
