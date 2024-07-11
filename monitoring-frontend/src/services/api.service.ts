import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { UserLogin } from '../models/user';
import { Organization, OrganizationList } from '../models/organization';
import { Device, DeviceList } from '../models/device';
import * as uuid from 'uuid';
import { Sensor, SensorList } from '../models/sensor';
import { Task, TaskList } from '../models/task';
import { Metric, MetricList } from '../models/metric';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http: HttpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
  };

  registerUser( username: string, password: string): Observable<any> {
    const id = uuid.v4().toString();
    const user = new UserLogin(id, username, password);
    return this.http.post('/api/register', user, this.httpOptions);
  }

  loginUser(username: string, password: string): Observable<any> {
    const user = new UserLogin('', username, password);
    return this.http.post('/api/login', user, this.httpOptions);
  }

  createOrganization(name: string, streetAddress: string, userId: string): Observable<any> {
    const id = uuid.v4().toString();
    const organization = new Organization(id, name, streetAddress, userId);
    return this.http.post('/api/organizations/save', organization, this.httpOptions);
  }

  createDevice(name: string, ip: string, port: string, organizationId: string): Observable<any> {
    const id = uuid.v4().toString();
    const device = new Device(id, name, ip, parseInt(port), organizationId);
    return this.http.post('/api/devices/save', device, this.httpOptions);
  }

  getOrganizations(userId: string): Observable<OrganizationList> {
    return this.http.post('/api/organizations', userId, this.httpOptions).pipe(
      map((response: any) => {
        return new OrganizationList(response);
      }))
  }

  getDevices(organizationId: string): Observable<DeviceList> {
    return this.http.post('/api/devices', organizationId, this.httpOptions).pipe(
      map((response: any) => {
        return new DeviceList(response);
      }))
  }

  getTasks(deviceId: string): Observable<TaskList> {
    return this.http.post('/api/tasks', deviceId, this.httpOptions).pipe(
      map((response: any) => {
        return new TaskList(response);
      }))
  }

  getSensors(): Observable<SensorList> {
    return this.http.post('/api/sensors/all', this.httpOptions).pipe(
      map((response: any) => {
        return new SensorList(response);
      }))
  }

  getMetrics(taskId: string): Observable<MetricList> {
    return this.http.post('/api/metrics', taskId, this.httpOptions).pipe(
      map((response: any) => {
        return new MetricList(response);
      })) 
  }

  getSensorById(sensorId: string): Observable<any> {
    return this.http.post('/api/sensors/' + sensorId, this.httpOptions);
  }

  //dummy function, need to be corrected
  changeScheduler(device: any, scheduler: string): Observable<any> {
    return this.http.post('/api/devices/scheduler/' + scheduler, [device], this.httpOptions).pipe(
      map((response: any) => {
        return new DeviceList(response);
      }))
  }

  createSensor(sensor: Sensor): Observable<any> {
    const id = uuid.v4().toString();
    sensor.id = id;
    return this.http.post('/api/sensors/save', sensor, this.httpOptions);
  }

  createMetric(metricName: string, taskId: string, position: number): Observable<any> {
    const id = uuid.v4().toString();
    const metric = new Metric(id, metricName, 0, JSON.parse(JSON.stringify({date: new Date()})).date, position, taskId);
    return this.http.post('/api/metrics/save', metric, this.httpOptions);
  }

  createTask(task: Task): Observable<any> {
    const id = uuid.v4().toString();
    task.id = id;
    return this.http.post('/api/tasks/save', task, this.httpOptions);
  }

  deleteDevice(deviceId: string): Observable<any>{
    return this.http.delete('/api/devices/'+ deviceId + '/delete', this.httpOptions);
  }

  deleteOrganization(organizationId: string): Observable<any>{
    return this.http.delete('/api/organizations/'+ organizationId + '/delete', this.httpOptions);
  }

  deleteTask(taskId: string): Observable<any>{
    return this.http.delete('/api/tasks/'+ taskId + '/delete', this.httpOptions);
  }
}
