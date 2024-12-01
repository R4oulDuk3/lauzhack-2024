package com.lauzhack.backend.controllers;

import com.lauzhack.backend.models.MetricDto;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/metrics")
@CrossOrigin()
@Slf4j
public class MetricController {

    private final MeterRegistry meterRegistry;

    private final Map<String, Counter> counters = new ConcurrentHashMap<>();
    private final Map<String, AtomicReference<Double>> gauges = new ConcurrentHashMap<>();


    @PostMapping("/send")
    public ResponseEntity<String> sendMetrics(@RequestBody List<MetricDto> metrics) {
        try {
            for (MetricDto metric : metrics) {
                log.info("Received metric {} {} {}", metric.getName(), metric.getType(), metric.getValue());

                switch (metric.getType().toLowerCase()) {
                    case "counter":
                        handleCounter(metric);
                        break;
                    case "gauge":
                        handleGauge(metric);
                        break;
                    default:
                        log.warn("Unknown metric type: {}", metric.getType());
                }
            }

            return ResponseEntity.ok("Metrics processed successfully");
        } catch (Exception e) {
            log.error("Error processing metrics", e);
            return ResponseEntity.internalServerError().body("Error on posting metrics: " + e.getMessage());
        }
    }

    private void handleCounter(MetricDto metric) {
        Counter counter = counters.computeIfAbsent(metric.getName(), name ->
                Counter.builder(name)
                        .description("Counter for " + name)
                        .register(meterRegistry)
        );

        // Increment by the specified value (or 1 if value is null)
        double incrementValue = metric.getValue() != null ? metric.getValue() : 1.0;
        counter.increment(incrementValue);
    }

    private void handleGauge(MetricDto metric) {
        if (metric.getValue() == null) {
            log.warn("Gauge {} received with null value, ignoring", metric.getName());
            return;
        }

        var ref = gauges.computeIfAbsent(metric.getName(), name ->
                {
                    final AtomicReference<Double> valueHolder = new AtomicReference<>(metric.getValue());
                    Gauge.builder(metric.getName(), valueHolder::get).strongReference(true).register(meterRegistry);
                    return valueHolder;
                }
        );

        ref.set(metric.getValue());
    }


    @GetMapping("/check")
    public ResponseEntity<Void> serviceCheck() {
        return ResponseEntity.ok().build();
    }

}

