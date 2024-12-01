package com.lauzhack.backend.models;

import lombok.Data;

@Data
public class MetricObject {
    private String metric_name;
    private String type;
    private Double value;
}