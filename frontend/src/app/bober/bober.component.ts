import {Component, OnInit} from '@angular/core';
import {TelemetryData} from "../../models/models";
import {BoberService} from "../../service/bober.service";

@Component({
  selector: 'app-bober',
  templateUrl: './bober.component.html',
  styleUrls: ['./bober.component.scss']
})
export class BoberComponent implements OnInit{
  telemetryData: TelemetryData | null = null;
  error: string | null = null;

  constructor(private boberService: BoberService) {}

  ngOnInit(): void {
    this.loadTelemetryData();
  }

  loadTelemetryData(): void {
    this.error = null;

    console.log("ZOVEMO KURAC")

    this.boberService.getTelemetryData()
      .subscribe({
        next: (data: any) => {
          console.log("KRUAC STIGAO")
          console.log(data)
          this.telemetryData = data;
        },
        error: (err: any) => {
          this.error = 'Failed to load telemetry data';
          console.error('Error loading telemetry data:', err);
        }
      });
  }
}
