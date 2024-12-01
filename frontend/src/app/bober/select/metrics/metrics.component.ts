import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, startWith, Subscription, switchMap} from "rxjs";
import { Chart, registerables } from 'chart.js';  // Add registerables
Chart.register(...registerables);  // Register all chart components
import {BoberService} from "../../../../service/bober.service";
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, OnDestroy {
  private memoryChart: Chart | null = null;
  private updateSubscription: Subscription | null = null;
  constructor(private boberService: BoberService) {}
  ngOnInit() {
    this.updateSubscription = interval(30000)  // Update every 30 seconds
      .pipe(
        startWith(0),  // Trigger initial load
        switchMap(() => this.boberService.queryPrometheusRange(
          'bobst_pi_memory_percent',
          Math.floor(Date.now() / 1000) - 3600,  // Start time (1 hour ago)
          Math.floor(Date.now() / 1000),         // End time (now)
          15                                     // 15-second intervals
        ))
      )
      .subscribe({
        next: (data) => {
          console.log("WE GOT DATA")
          console.log(data)
          this.updateMemoryChart(data)
        },
        error: (error) => console.error('Error fetching memory data:', error)
      });
  }
  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
    if (this.memoryChart) {
      this.memoryChart.destroy();
    }
  }
  private updateMemoryChart(data: any) {
    const formattedData = this.boberService.formatTimeSeriesData(data);
    if (this.memoryChart) {
      this.memoryChart.destroy();
    }
    const ctx = document.getElementById('memoryChart') as HTMLCanvasElement;
    this.memoryChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedData.map(d => new Date(d.time).toLocaleTimeString()),
        datasets: [{
          label: 'Memory Usage (%)',
          data: formattedData.map(d => d.value),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Memory Usage Over Time'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,  // Since it's a percentage
            title: {
              display: true,
              text: 'Memory Usage (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        }
      }
    });
  }
}
