import { Component } from '@angular/core';
import {PrometheusAlert} from "../../../../models/models";
import {Subscription} from "rxjs";
import {BoberService} from "../../../../service/bober.service";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  alerts: PrometheusAlert[] = [];
  private subscription: Subscription | null = null;

  constructor(private alertService: BoberService) {}

  ngOnInit() {
    this.subscription = this.alertService.getAlertsStream().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
      },
      error: (error) => {
        console.error('Error fetching alerts:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'severity-critical';
      case 'warning':
        return 'severity-warning';
      case 'info':
        return 'severity-info';
      default:
        return 'severity-default';
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}
