import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LogEntry {
  severity: string; 
  message: string;  
  timestamp: number; 
}

@Injectable({
  providedIn: 'root'
})

export class LogServiceService {
  private readonly apiUrl = 'http://localhost/api/v1/logs/pull/5';

  constructor(private http: HttpClient) {}

  fetchLogs(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(this.apiUrl);
  }
}
