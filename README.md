# RITA
## Overview
RITA (Real-time IoT Tasks Administrator) is an application created to manage real time monitoring tasks within a pool of devices that are collecting data from a pool of sensos and sending that data to our app, which will enable the user to see it over time.

In this application we have basically four distinct and highly differentiated applications that need to be deployed for the whole app to work:

1. **Monitoring Backend**: This is the core application based on the Spring Java framework, which we are using to deploy our REST API in charge of managing the data of our application.
2. **Monitoring frontend**: This is the front-end part of our app in charge of collecting the data from the user. It's done using the Angular Javascript framework.
3. **Monitoring Iot**: This is the code in C needed by the devices to collect the tasks planned by our core application and to push the metrics obtained from the sensors back. (We have some Docker and Docker Compose files to be able to simulate the deployment of several devices so the functionality can be tested)

In addition we need to deploy aloingside this applications:

3. **MongoDB**: This will be the DB in charge of permanently storing the data.
4. **RabbitMQ**: This will be the Message Broker in charge of comunicating the devices with our core application or backend.


## Deployment

To deploy our application you just need to run the docker file by using the command:

```bash 
    docker-compose up
```

Then, once all the containers are up and running, you will need to create a device in the application, copy the device id, and create an environment variable with it (we do this so the device only reads the messages coming to it). After that, you just need to deploy the c code on your machine or device for that you will have to compile it and run it:

```bash 
    export DEVICE_ID=<device id obtained from the web application>
    gcc amqListenernPublisher.c -o amqListenernPublisher -lrabbitmq -ljansson
    ./amqListenernPublisher
```

If need it give the file, execution rights:

```bash 
    chmod +x amqListenernPublisher
```

Please note, this setup assumes you are deploying everything locally. If you plan to move the C code to another device or machine you will need to update the function:

```C 
    void *publisher_n_listener_thread(void *arg)
```

By updating the 'hostname' variable with the URL where you have deployed the multi-container applications.
