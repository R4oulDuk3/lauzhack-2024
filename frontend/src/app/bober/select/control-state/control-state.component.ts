import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {BoberService} from "../../../../service/bober.service";
import {ConfigData, SystemInfo} from "../../../../models/models";
@Component({
  selector: 'app-control-state',
  templateUrl: './control-state.component.html',
  styleUrls: ['./control-state.component.scss']
})
export class ControlStateComponent  implements OnInit, OnDestroy {
  public isDeviceOn: boolean = false;
  private readonly speedValues: number[] = [10, 11, 12, 13, 14];
  public currentSpeedIndex: number = 0;
  private systemInfo: SystemInfo | null = null;
  private readonly destroy$ = new Subject<void>();
  readonly displayedColumns: string[] = ['property', 'value'];
  private readonly mockSystemInfo: SystemInfo = {
    pythonVersion: '0',
    osName: 'N/A',
    osSystem: 'N/A',
    osRelease: 'N/A',
    osVersion: 'N/A',
    cpuCountPhysical: 0,
    cpuCountLogical: 0,
    cpuFreqCurrent: 0,
    totalRam: 0,
    diskTotal: 0
  };
  constructor(private boberService: BoberService) {}
  ngOnInit(): void {
    this.loadSystemInfo();
    this.loadConfigInfo()
    // For testing, load mock data
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // Getters for template
  get deviceOn(): boolean {
    return this.isDeviceOn;
  }
  // Getter for the actual speed value
  get currentSpeed(): number {
    return this.speedValues[this.currentSpeedIndex];
  }
  // Getter for display
  get speedLabel(): string {
    return `Speed: ${this.currentSpeed}`;
  }
  formatSpeedLabel = (value: number): string => {
    return `${this.speedValues[value]}`;
  }
  onSpeedChange(index: number): void {
    this.currentSpeedIndex = index;
    this.updateDeviceSpeed();
  }
  private updateDeviceSpeed(): void {
    console.log(`Device speed updated to: ${this.currentSpeed}`);
    const config: ConfigData = {
      speed: this.currentSpeed,
      power: this.isDeviceOn ? 'ON' : 'OFF'
    };
    this.boberService.updateConfigData(config).subscribe({
      next: (response) => console.log('Speed updated:', response),
      error: (error) => console.error('Failed to update speed:', error)
    });
  }
  // Control methods
  onToggleChange(event: MatSlideToggleChange): void {
    this.isDeviceOn = event.checked;
    this.updateDeviceState();
  }
  // Data loading methods
  private loadSystemInfo(): void {
    this.boberService.getSystemInfo().subscribe({
      next: (info) => {
        console.log('System info:', info)
        this.systemInfo = info
      },
      error: (error) => {
        console.error('Failed to get system info:', error)
        this.loadMockData();
      }
    });
  }
  private loadConfigInfo(){
    this.boberService.getConfigData().subscribe({
      next: (config) => {
        console.log("BOBOERR")
        console.log(config)
        // Set initial device state
        this.isDeviceOn = config.power === "ON";
        for (let i = 0; i < this.speedValues.length; i++) {
          if (this.speedValues[i] === config.speed){
            this.currentSpeedIndex = i
          }
        }
      },
      error: (error) => {
        console.error('Failed to get initial config:', error);
        // Set default values if failed to get config
        this.isDeviceOn = false;
        this.currentSpeedIndex = 0;
      }
    });
  }
  private loadMockData(): void {
    this.systemInfo = this.mockSystemInfo;
  }
  // Device control methods
  private updateDeviceState(): void {
    console.log(`Device state updated to: ${this.isDeviceOn}`);
    const config: ConfigData = {
      speed: this.currentSpeed,
      power: this.isDeviceOn ? 'ON' : 'OFF'
    };
    this.boberService.updateConfigData(config).subscribe({
      next: (response) => console.log('Device state updated:', response),
      error: (error) => console.error('Failed to update device state:', error)
    });
  }
  // Data formatting for display
  getSystemInfoRows(): {property: string, value: string}[] {
    if (!this.systemInfo) return [];
    return [
      { property: 'Python Version', value: this.systemInfo.pythonVersion },
      { property: 'OS Name', value: this.systemInfo.osName },
      { property: 'OS System', value: this.systemInfo.osSystem },
      { property: 'OS Release', value: this.systemInfo.osRelease },
      { property: 'OS Version', value: this.systemInfo.osVersion },
      { property: 'Physical CPU Cores', value: `${this.systemInfo.cpuCountPhysical}` },
      { property: 'Logical CPU Cores', value: `${this.systemInfo.cpuCountLogical}` },
      { property: 'CPU Frequency', value: `${this.systemInfo.cpuFreqCurrent} MHz` },
      { property: 'Total RAM', value: `${this.systemInfo.totalRam} GB` },
      { property: 'Total Disk Space', value: `${this.systemInfo.diskTotal} GB` }
    ];
  }
  // Helper methods for template
  formatValue(value: any): string {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value);
  }
}
