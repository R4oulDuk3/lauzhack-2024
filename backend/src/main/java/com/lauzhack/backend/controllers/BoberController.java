package com.lauzhack.backend.controllers;

import com.lauzhack.backend.models.TelemetryData;
import com.lauzhack.backend.services.BoberService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/bober")
@CrossOrigin()
public class BoberController {

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

