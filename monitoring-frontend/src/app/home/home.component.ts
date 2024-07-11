import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { Organization, OrganizationList } from '../../models/organization';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Device, DeviceList } from '../../models/device';
import { ValidatorFn, FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { SensorDialogComponent } from '../sensor-dialog/sensor-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sensor, SensorList } from '../../models/sensor';
import { Task, TaskList } from '../../models/task';
import { MetricsDialogComponent } from '../metrics-dialog/metrics-dialog.component';
import { MetricList } from '../../models/metric';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,
            MatFormFieldModule, 
            ReactiveFormsModule,
            MatInputModule,
            MatGridListModule,
            MatExpansionModule,
            MatIconModule,
            MatButtonModule, 
            MatDividerModule,
            MatSelectModule,
            MatMenuModule,
            ClipboardModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, OnDestroy{
  snackBar: MatSnackBar = inject(MatSnackBar)
  apiService: ApiService = inject(ApiService)
  dialog: MatDialog = inject(MatDialog)
  storageService: StorageService = inject(StorageService);
  organizationFormBuilder: FormBuilder = inject(FormBuilder)
  deviceFormBuilder: FormBuilder = inject(FormBuilder)
  schedulerFormBuilder: FormBuilder = inject(FormBuilder)
  router: Router = inject(Router);

  webSocket: WebSocket = new WebSocket('/taskStatus');
  selectedOrganization: Organization = new Organization('', '', '', '');
  organizations: OrganizationList = new OrganizationList([]);
  devices: DeviceList = new DeviceList([]);
  currentUser: string = '';
  panelOpenState = false;
  matGridColumns = 2;
  matGridHeight = "100%";
  sensors: SensorList = new SensorList([]);
  tasks: TaskList = new TaskList([]);
  metrics: MetricList = new MetricList([]);

  organizationForm = this.organizationFormBuilder.group({
    name: ['', Validators.required],
    streetAdress: ['', Validators.required],
  })

  deviceNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && this.devices.devices.find((device: Device) => device.name === control.value)){
        return { 'name': true };
      }
      return null;
    };
  }

  deviceForm = this.deviceFormBuilder.group({
    name: ['', [Validators.required, this.deviceNameValidator()]],
    ip: ['', [Validators.required]],
    port: ['', [Validators.required, Validators.min(0), Validators.max(65535)]],
  })

  schedulerForm = this.schedulerFormBuilder.group({
    scheduler: ['', Validators.required]
  })
  
  ngOnInit(): void {
    if(window.innerWidth < 800){
      this.matGridColumns = 1;
      this.matGridHeight = "70%";
    } else {
      this.matGridColumns = 2;
      this.matGridHeight = "100%";
    }
    this.webSocket.onmessage = (event) => {
      const task = JSON.parse(event.data);
      this.tasks.tasks = this.tasks.tasks.map((t) => {
        if(t.id === task.id) {
          return task;
        }
        return t;
      });
    }
    this.currentUser = this.storageService.getUser();
    this.apiService.getOrganizations(this.currentUser).subscribe({
      next: (organizations) => {
        this.organizations = organizations
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
    this.apiService.getSensors().subscribe({
      next: (sensors) => {
        this.sensors = sensors;
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.webSocket.close();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: any; }; }) {
    if(event.target.innerWidth < 800){
      this.matGridColumns = 1;
      this.matGridHeight = "70%";
    } else {
      this.matGridColumns = 2;
      this.matGridHeight = "100%";
    }
  }

  copy(deviceId:string) : string {
    return deviceId;
  }

  createOrganization(): void {
    this.apiService.createOrganization(<string>this.organizationForm.value.name,<string>this.organizationForm.value.streetAdress, this.currentUser).subscribe({
      next:(organization) => {
        this.organizations.organizations.push(organization);
      },
      error: (e) => console.log(e)
    })
  }

  createDevice() : void{
    if(this.selectedOrganization.id === '') return console.log('No organization selected');
    this.apiService.createDevice(<string>this.deviceForm.value.name, <string>this.deviceForm.value.ip, <string>this.deviceForm.value.port, this.selectedOrganization.id).subscribe({
      next:(device) => {
        this.devices.devices.push(device);
      },
      error: (e) => console.log(e)
    })
  }

  getDevices(organization: Organization) {
    this.selectedOrganization = organization;
    this.apiService.getDevices(organization.id)
      .subscribe({
        next: (devices) => {
          this.devices = devices;
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
    })
  }

  getTasks(device: Device) {
    this.apiService.getTasks(device.id)
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
    })
  }

  getSensorName(sensorId: string) {
    return this.sensors.sensors.find(sensor => sensor.id === sensorId)?.name;
  }

  changeScheduler(device: Device) {
    this.apiService.changeScheduler(device, <string>this.schedulerForm.value.scheduler).subscribe({
      next: (updatedData: any) => {
        console.log(updatedData)
      },
      error: (e: any) => console.log(e)
    })
  }

  deleteTask(task: Task) {
    this.apiService.deleteTask(task.id).subscribe({
      next: (taskDeleted: any) => {
        this.tasks.tasks = this.tasks.tasks.filter((t) => t.id !== task.id); 
      },
      error: (e: any) => console.log(e)
    })
  }

  deleteDevice(device: Device) {
    this.apiService.deleteDevice(device.id).subscribe({
      next: (deviceDeleted: any) => {
        this.devices.devices = this.devices.devices.filter((d) => d.id !== device.id); 
      },
      error: (e: any) => console.log(e)
    })
  }

  deleteOrganization(organization: Organization) {
    this.apiService.deleteOrganization(organization.id).subscribe({
      next: (organizationDeleted: any) => {
        this.organizations.organizations = this.organizations.organizations.filter((o) => o.id !== organization.id); 
        this.devices.devices = [];
      },
      error: (e: any) => console.log(e)
    })
  }

  openTaskDialog(deviceId: string) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '80%',
      width: '60%',
      data: {sensors: this.sensors,
             deviceId: deviceId},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.apiService.createTask(result).subscribe({
        next: (task: any) => {
          if(task.id === "") {
            this.snackBar.open('Error creating task', 'Dismiss', {
              duration: 3000
            });
          } else {
            this.tasks.tasks.push(task);
            this.snackBar.open('Task Created', 'Dismiss', {
              duration: 3000
            });

            let position = 0;

            const sensor : Sensor = this.sensors.sensors.filter((s) => s.id === task.sensorId)[0];
            sensor.metrics.split(',').forEach((metric:string) => {        
              this.apiService.createMetric(metric, task.id, position).subscribe({
                next: (metrics: any) => {
                  console.log("Metric created");
                },
                error: (e: any) => console.log(e)
              });
              position++;
            })

          }
        },
        error: (e: any) => console.log(e)
      })
    });
  }

  getBorder(status: string) {
    switch (status) {
      case 'ACTIVE':
        return '2px solid green';
      case 'INACTIVE':
        return '2px solid red';
      case 'PENDING':
        return '2px solid yellow';
      default:
        return 'black';
    }
  }

  openSensorDialog() {
    const dialogRef = this.dialog.open(SensorDialogComponent, {
      height: '80%',
      width: '70%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.apiService.createSensor(result).subscribe({
        next: (sensor: any) => {
          if(sensor.id === "") {
            this.snackBar.open('Sensor Already Exists', 'Dismiss', {
              duration: 3000
            });
          } else {
            this.sensors.sensors.push(sensor);
            this.snackBar.open('Sensor Created', 'Dismiss', {
              duration: 3000
            });
          }
        },
        error: (e: any) => console.log(e)
      });
    });
  }

  openMetricsDialog(task: Task) {
    let values = new Map();
    let timeStamps = new Map();
    let metricNames = new Array();

    this.apiService.getMetrics(task.id).subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        
        metricNames = Array.from(new Set(this.metrics.metrics.map(metric => metric.name)));
        metricNames.forEach((metricName : string ) => {
          values.set(metricName, 
                     this.metrics.metrics.filter(metric => metric.name === metricName).map(metric => metric.value));
          timeStamps.set(metricName, 
                         this.metrics.metrics.filter(metric => metric.name === metricName).map(metric => metric.date));
        });

        const dialogRef = this.dialog.open(MetricsDialogComponent, {
          height: '90%',
          width: '95%',
          data: {task: task,
                 values: values,
                 timeStamps: timeStamps,
                 metricNames: metricNames
          }
        });
      },
      error: (e: any) => console.log(e)
    });   

  }
}