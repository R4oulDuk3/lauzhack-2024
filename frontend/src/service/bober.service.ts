import { Injectable } from '@angular/core';

import {environment} from "../environments/environment";
import {catchError, interval, map, Observable, startWith, switchMap} from "rxjs";
import {ConfigData, PrometheusAlert, PrometheusQueryResult, SystemInfo} from "../models/models";
import {HttpClient, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BoberService {

  private apiUrl = `${environment.apiBaseUrl + environment.apiDataEndpoint}`;
  private systemInfoUrl = `${environment.apiBaseUrl + environment.systemInfo}`;
  private readonly prometheusUrl = 'http://localhost:9090';  // Direct Prometheus URL

  constructor(private http: HttpClient) { }


  getSystemInfo(): Observable<SystemInfo> {
    return this.http.get<SystemInfo>(`${this.systemInfoUrl}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching system info:', error);
          throw error;
        })
      );
  }


  // Get current config
  getConfigData(): Observable<ConfigData> {
    return this.http.get<ConfigData>(`${environment.apiBaseUrl}/api/v1/config`)
      .pipe(
        catchError(error => {
          console.error('Error fetching config data:', error);
          throw error;
        })
      );
  }

  // Update config
  updateConfigData(config: ConfigData): Observable<string> {
    return this.http.post<string>(`${environment.apiBaseUrl}/api/v1/config`, config)
      .pipe(
        catchError(error => {
          console.error('Error updating config:', error);
          throw error;
        })
      );
  }

  // Query range of values
  queryPrometheusRange(query: string, start: number, end: number, step: number): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('start', start.toString())
      .set('end', end.toString())
      .set('step', step.toString());

    return this.http.get<any>(`${this.prometheusUrl}/api/v1/query_range`, { params });
  }


  // Helper methods for common queries
  getMachineSpeed(timeRange: number = 3600): Observable<any> {
    const end = Math.floor(Date.now() / 1000);
    const start = end - timeRange;
    return this.queryPrometheusRange('machine_speed', start, end, 15);
  }

  getBoxCount(timeRange: number = 3600): Observable<any> {
    const end = Math.floor(Date.now() / 1000);
    const start = end - timeRange;
    return this.queryPrometheusRange('rate(box_count_total[5m])', start, end, 15);
  }


  formatTimeSeriesData(data: any): any[] {
    if (!data?.data?.result?.[0]?.values) {
      return [];
    }

    return data.data.result[0].values.map(([timestamp, value]: [number, string]) => ({
      time: new Date(timestamp * 1000),
      value: parseFloat(value)
    }));
  }

  getAlerts(): Observable<PrometheusAlert[]> {
    return this.http.get<any>(`${this.prometheusUrl}/api/v1/alerts`)
      .pipe(
        map(response => response.data.alerts)
      );
  }

  // Get real-time updates
  getAlertsStream(): Observable<PrometheusAlert[]> {
    return interval(10000).pipe(
      startWith(0),
      switchMap(() => this.getAlerts())
    );
  }

}
