package com.lauzhack.backend.models;

import lombok.Data;

@Data
public class TelemetryData {
    private String timestamp;
    private String datasource;
    private String machineid;
    private Integer totaloutputunitcount;
    private Double machineSpeed;
}