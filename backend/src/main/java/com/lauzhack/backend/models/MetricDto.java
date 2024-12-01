package com.lauzhack.backend.models;

import lombok.Data;

@Data
public class MetricDto {
    private String name;
    private String type;
    private Double value;
}