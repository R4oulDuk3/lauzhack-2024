import { Injectable } from '@angular/core';

import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {TelemetryData} from "../models/models";
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BoberService {

  private apiUrl = `${environment.apiBaseUrl + environment.apiDataEndpoint}`;

  constructor(private http: HttpClient) { }

  getTelemetryData(): Observable<TelemetryData> {
    return this.http.get<TelemetryData>(this.apiUrl);
  }

  updateTelemetryData(data: TelemetryData): Observable<any> {
    return this.http.post(this.apiUrl, { telemetry: data });
  }
}
