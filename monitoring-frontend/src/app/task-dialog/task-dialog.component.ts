import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Task } from '../../models/task';
import {MatSelectModule} from '@angular/material/select';
import { Sensor, SensorList } from '../../models/sensor';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})

export class TaskDialogComponent {
  task: Task = new Task('', '', '', 0, 0, 0, 0, '', '', '');

  constructor(
    public taskFormBuilder: FormBuilder = new FormBuilder(),
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  taskForm = this.taskFormBuilder.group({
    name: ['', Validators.required],
    period: ['', Validators.required],
    cpuTime: ['', Validators.required],
    maxResponseTime: ['', Validators.required],
    portNumber: ['', Validators.required],
    portType: ['', Validators.required],
    sensor: ['', Validators.required],
  });

  buildTask() {
    this.task.name = <string>this.taskForm.value.name;
    this.task.status = 'INACTIVE';
    this.task.period = parseInt(<string>this.taskForm.value.period);
    this.task.cpuTime = parseInt(<string>this.taskForm.value.cpuTime);
    this.task.maxResponseTime = parseInt(<string>this.taskForm.value.maxResponseTime);
    this.task.portNumber = parseInt(<string>this.taskForm.value.portNumber);
    this.task.portType = <string>this.taskForm.value.portType;
    this.task.sensorId = this.data.sensors.sensors.find((sensor : Sensor) => sensor.name === <string>this.taskForm.value.sensor)?.id;
    this.task.deviceId = this.data.deviceId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
