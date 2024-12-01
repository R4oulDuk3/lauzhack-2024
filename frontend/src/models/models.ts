
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

// models/metric.model.ts
export interface MetricConfig {
  id: string;           // Unique identifier for the chart
  query: string;        // Prometheus query
  title: string;        // Chart title
  label: string;        // Dataset label
  color: string;        // Line color
  maxValue?: number;    // Optional maximum value for y-axis
  yAxisLabel: string;   // Y-axis label
}

// models/alert.model.ts
export interface PrometheusAlert {
  labels: {
    alertname: string;
    severity: string;
    instance: string;
    [key: string]: string;
  };
  annotations: {
    description: string;
    summary: string;
    [key: string]: string;
  };
  state: string;
  activeAt: string;
  value: string;
}
