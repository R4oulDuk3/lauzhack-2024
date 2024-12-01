import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogServiceService, LogEntry } from '../../../../service/log.service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent {
  prompt: string = '$';
  currentInput: string = '';
  lines: Array<{ type: string; timestamp: string; message: string }> = [];
  private fetchLogsSubscription?: Subscription;
  private timerInterval: any;

  constructor(private logService: LogServiceService) {}

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
    if (this.fetchLogsSubscription) {
      this.fetchLogsSubscription.unsubscribe();
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => this.fetchLogs(), 2000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  fetchLogs() {
    this.fetchLogsSubscription = this.logService.fetchLogs().subscribe(
      (logs: LogEntry[]) => {
        this.addLogsToTerminal(logs);
      },
      (error) => {
        console.error('Failed to fetch logs:', error);
      }
    );
  }

  addLogsToTerminal(logs: LogEntry[]) {
    logs.forEach((log) => {
      const formattedTimestamp = new Date(log.timestamp * 1000).toLocaleString();
      this.lines.push({
        type: log.severity,
        timestamp: formattedTimestamp,
        message: log.message,
      });
    });
  }

}