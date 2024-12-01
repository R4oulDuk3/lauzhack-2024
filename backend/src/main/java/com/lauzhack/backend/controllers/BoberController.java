package com.lauzhack.backend.controllers;

import com.lauzhack.backend.models.TelemetryData;
import com.lauzhack.backend.services.BoberService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@AllArgsConstructor
@RestController
@RequestMapping("/api/bober")
@CrossOrigin()
public class BoberController {

    private final MeterRegistry meterRegistry;

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


    @PostMapping("/count")
    public String countString(@RequestBody String input) {
        // Get or create counter for this string
        Counter counter = counters.computeIfAbsent(input, key ->
                Counter.builder("input")
                        .description("Counts occurrences of string: " + key)
                        .register(meterRegistry)
        );

        // Increment the counter
        counter.increment();

        // Get current count
        double count = counter.count();

        return String.format("Counted '%s': %s times", input, (int)count);
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

