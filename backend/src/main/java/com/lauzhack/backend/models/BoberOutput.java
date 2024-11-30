package com.lauzhack.backend.models;


import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class BoberOutput {
    private String machineId;
    private Double speed;
    private Integer outputCount;
    private String timestamp;
    private String datasource;
}