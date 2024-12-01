export interface TelemetryData {
  timestamp: string;
  datasource: string;
  machineid: string;
  totaloutputunitcount: number;
  machineSpeed: number;
}

// models/prometheus.model.ts
export interface PrometheusQueryResult {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: { [key: string]: string };
      values: [number, string][]; // timestamp, value pairs
    }>;
  };
}

// models/system-info.model.ts
export interface SystemInfo {
  pythonVersion: string;
  osName: string;
  osSystem: string;
  osRelease: string;
  osVersion: string;
  cpuCountPhysical: number;
  cpuCountLogical: number;
  cpuFreqCurrent: number | string;
  totalRam: number;
  diskTotal: number;
}

export interface ConfigData {
  speed: number;
  power: string;
}
