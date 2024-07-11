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
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-sensor-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './sensor-dialog.component.html',
  styleUrl: './sensor-dialog.component.css'
})

export class SensorDialogComponent {
  sensor: Sensor = new Sensor('', '', '', '');

  constructor(
    public sensorFormBuilder: FormBuilder = new FormBuilder(),
    public dialogRef: MatDialogRef<SensorDialogComponent>,
  ) {}

  sensorForm = this.sensorFormBuilder.group({
    name: ['', Validators.required],
    function: ['', Validators.required],
    metrics: ['', Validators.required]
  })

  buildSensor() {
    this.sensor.name = <string>this.sensorForm.value.name;
    this.sensor.function = <string>this.sensorForm.value.function;
    this.sensor.metrics = <string>this.sensorForm.value.metrics;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
