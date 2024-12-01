package com.lauzhack.backend.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lauzhack.backend.models.MetricObject;
import com.lauzhack.backend.models.TelemetryData;
import com.lauzhack.backend.services.BoberService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.prometheus.metrics.core.metrics.Gauge;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@AllArgsConstructor
@RestController
@RequestMapping("/api/bober")
@CrossOrigin()
public class BoberController {

    private final MeterRegistry meterRegistry;
    private final ObjectMapper objectMapper;

    BoberService boberService;

    @PostMapping
    public ResponseEntity<String> processBoberData(@RequestBody String boberInputJson) {
        try {
            boberService.processAndSaveBoberData(boberInputJson);
            return ResponseEntity.ok("Data processed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing data: " + e.getMessage());
        }
    }

    private final Map<String, Counter> counters = new ConcurrentHashMap<>();


    @PostMapping("/metrics")
    public ResponseEntity<?> processMetrics(@RequestBody String jsonBody) {
        try {
            // Parse JSON array into List<MetricObject>
            List<MetricObject> metrics = objectMapper.readValue(jsonBody, new TypeReference<List<MetricObject>>() {});

            // Process each metric
            for (MetricObject metric : metrics) {
                switch (metric.getType().toLowerCase()) {
                    case "counter":
                        Counter counter = Counter.builder(metric.getMetric_name())
                                .description("Counter for " + metric.getMetric_name())
                                .register(meterRegistry);
                        // Increment by the value
                        counter.increment(metric.getValue());
                        break;

                    case "gauge":
                        meterRegistry.gauge(metric.getMetric_name(), metric.getValue());
                        break;

                    default:
                        throw new IllegalArgumentException("Unknown metric type: " + metric.getType());
                }
            }

            return ResponseEntity.ok("Metrics processed successfully");
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Invalid JSON format: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing metrics: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<TelemetryData> getBoberData() {
        TelemetryData data = boberService.getTelemetryData();
        if (data != null) {
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Void> serviceCheck() {
        return ResponseEntity.ok().build();
    }

}

