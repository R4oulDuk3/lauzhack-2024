import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, startWith, Subscription, switchMap} from "rxjs";
import { Chart, registerables } from 'chart.js';  // Add registerables
Chart.register(...registerables);  // Register all chart components
import {BoberService} from "../../../../service/bober.service";
import {MetricConfig} from "../../../../models/models";
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, OnDestroy {
  private charts: Map<string, Chart> = new Map();
  private updateSubscription: Subscription | null = null;

  // Define your metrics configuration
  metrics: MetricConfig[] = [
    {
      id: 'memory',
      query: 'bobst_pi_memory_percent',
      title: 'Memory Usage Over Time',
      label: 'Memory Usage (%)',
      color: 'rgb(255, 99, 132)',
      maxValue: 100,
      yAxisLabel: 'Memory Usage (%)'
    },
    {
      id: 'cpuUsage',
      query: 'bobst_pi_cpu_usage_percent',
      title: 'CPU Usage',
      label: 'CPU Usage (%)',
      color: 'rgb(255, 99, 132)',
      maxValue: 100,
      yAxisLabel: 'Usage (%)'
    },
    {
      id: 'cpuFreqMin',
      query: 'bobst_pi_cpu_freq_min',
      title: 'CPU Minimum Frequency',
      label: 'Min Frequency (MHz)',
      color: 'rgb(54, 162, 235)',
      yAxisLabel: 'MHz'
    },
    {
      id: 'cpuFreqMax',
      query: 'bobst_pi_cpu_freq_max',
      title: 'CPU Maximum Frequency',
      label: 'Max Frequency (MHz)',
      color: 'rgb(255, 99, 132)',
      yAxisLabel: 'MHz'
    },
    {
      id: 'cpuFreqCurrent',
      query: 'bobst_pi_cpu_freq_current',
      title: 'CPU Current Frequency',
      label: 'Current Frequency (MHz)',
      color: 'rgb(75, 192, 192)',
      yAxisLabel: 'MHz'
    },
    // Memory Metrics
    {
      id: 'memoryUsagePercent',
      query: 'bobst_pi_memory_percent',
      title: 'Memory Usage Percentage',
      label: 'Memory Usage (%)',
      color: 'rgb(153, 102, 255)',
      maxValue: 100,
      yAxisLabel: 'Usage (%)'
    },
    {
      id: 'memoryUsageGB',
      query: 'bobst_pi_memory_used_gb',
      title: 'Memory Used',
      label: 'Memory Used (GB)',
      color: 'rgb(255, 159, 64)',
      yAxisLabel: 'GB'
    },
    {
      id: 'memoryAvailable',
      query: 'bobst_pi_memory_available_gb',
      title: 'Memory Available',
      label: 'Available Memory (GB)',
      color: 'rgb(75, 192, 192)',
      yAxisLabel: 'GB'
    },
    {
      id: 'memoryTotal',
      query: 'bobst_pi_memory_total_gb',
      title: 'Total Memory',
      label: 'Total Memory (GB)',
      color: 'rgb(201, 203, 207)',
      yAxisLabel: 'GB'
    },

    // Disk Metrics
    {
      id: 'diskUsagePercent',
      query: 'bobst_pi_disk_percent',
      title: 'Disk Usage Percentage',
      label: 'Disk Usage (%)',
      color: 'rgb(255, 99, 132)',
      maxValue: 100,
      yAxisLabel: 'Usage (%)'
    },
    {
      id: 'diskUsageGB',
      query: 'bobst_pi_disk_used_gb',
      title: 'Disk Space Used',
      label: 'Used Space (GB)',
      color: 'rgb(54, 162, 235)',
      yAxisLabel: 'GB'
    },
    {
      id: 'diskFreeGB',
      query: 'bobst_pi_disk_free_gb',
      title: 'Disk Space Free',
      label: 'Free Space (GB)',
      color: 'rgb(75, 192, 192)',
      yAxisLabel: 'GB'
    },
    {
      id: 'diskTotalGB',
      query: 'bobst_pi_disk_total_gb',
      title: 'Total Disk Space',
      label: 'Total Space (GB)',
      color: 'rgb(153, 102, 255)',
      yAxisLabel: 'GB'
    },

    // Load Average Metrics
    {
      id: 'loadAverage1',
      query: 'bobst_pi_load_1min',
      title: 'Load Average (1 min)',
      label: 'Load Average',
      color: 'rgb(255, 99, 132)',
      yAxisLabel: 'Load'
    },
    {
      id: 'loadAverage5',
      query: 'bobst_pi_load_5min',
      title: 'Load Average (5 min)',
      label: 'Load Average',
      color: 'rgb(54, 162, 235)',
      yAxisLabel: 'Load'
    },
    {
      id: 'loadAverage15',
      query: 'bobst_pi_load_15min',
      title: 'Load Average (15 min)',
      label: 'Load Average',
      color: 'rgb(75, 192, 192)',
      yAxisLabel: 'Load'
    }
  ];

  constructor(private boberService: BoberService) {}

  ngOnInit() {
    this.updateSubscription = interval(30000).pipe(
      startWith(0),
      switchMap(() => {
        const promises = this.metrics.map(metric =>
          this.boberService.queryPrometheusRange(
            metric.query,
            Math.floor(Date.now() / 1000) - 3600,
            Math.floor(Date.now() / 1000),
            15
          ).toPromise()
        );
        return Promise.all(promises);
      })
    ).subscribe({
      next: (results) => {
        results.forEach((data, index) => {
          this.updateChart(this.metrics[index], data);
        });
      },
      error: (error) => console.error('Error fetching metrics:', error)
    });
  }

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }

  private updateChart(metric: MetricConfig, data: any) {
    const formattedData = this.boberService.formatTimeSeriesData(data);

    let chart = this.charts.get(metric.id);
    if (chart) {
      chart.destroy();
    }

    const ctx = document.getElementById(metric.id + 'Chart') as HTMLCanvasElement;
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedData.map(d => new Date(d.time).toLocaleTimeString()),
        datasets: [{
          label: metric.label,
          data: formattedData.map(d => d.value),
          borderColor: metric.color,
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
            text: metric.title
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: metric.maxValue,
            title: {
              display: true,
              text: metric.yAxisLabel
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

    this.charts.set(metric.id, chart);
  }
}
