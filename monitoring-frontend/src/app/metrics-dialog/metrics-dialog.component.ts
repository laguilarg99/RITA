import { Component, Inject, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule
} from "ng-apexcharts";
import { Metric, MetricList } from '../../models/metric';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-metrics-dialog',
  standalone: true,
  imports: [MatTabsModule,
            MatDialogTitle,
            MatDialogContent,
            MatDialogActions,
            MatDialogClose,
            MatFormFieldModule,
            NgApexchartsModule,
            MatIconModule
  ],
  templateUrl: './metrics-dialog.component.html',
  styleUrl: './metrics-dialog.component.css'
})
export class MetricsDialogComponent  {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  apiService: ApiService = inject(ApiService);

  constructor(
    public dialogRef: MatDialogRef<MetricsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log(data);
    this.chartOptions = {
      series: [
        {
          name: "Values",
          data: this.data.values.get(this.data.metricNames[0])!
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Value over time",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        type: "datetime",
        categories: this.data.timeStamps.get(this.data.metricNames[0])!
      }
    };;
  }

  changeChart(event: MatTabChangeEvent): void {
    this.chartOptions = {
      series: [
        {
          name: "Values",
          data: this.data.values.get(event.tab.textLabel)!
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Value over time",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        type: "datetime",
        categories: this.data.timeStamps.get(event.tab.textLabel)!
      }
    };
  }
  
  refreshData(): void {
    let metrics: MetricList;
    this.apiService.getMetrics(this.data.task.id).subscribe({
      next: (metrics) => {
        this.data.metrics = metrics;
        this.data.metricNames = Array.from(new Set(metrics.metrics.map(metric => metric.name)));
        this.data.metricNames.forEach((metricName : string ) => {
          this.data.values.set(metricName, 
                    metrics.metrics.filter(metric => metric.name === metricName).map(metric => metric.value));
          this.data.timeStamps.set(metricName, 
                        metrics.metrics.filter(metric => metric.name === metricName).map(metric => metric.date));
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
