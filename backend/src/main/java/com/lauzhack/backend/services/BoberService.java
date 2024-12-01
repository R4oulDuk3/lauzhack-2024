package com.lauzhack.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lauzhack.backend.models.TelemetryData;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.Getter;

public class BoberService {

    // Getter method to access the stored data if needed
    @Getter
    private TelemetryData telemetryData;

    private final ObjectMapper objectMapper;

    private final MeterRegistry meterRegistry;

    public BoberService(ObjectMapper objectMapper, MeterRegistry meterRegistry) {
        this.objectMapper = objectMapper;
        this.meterRegistry = meterRegistry;

        // Gauge for machine speed
        Gauge.builder("machine.speed", this, BoberService::getMachineSpeed)
                .description("Current machine speed")
                .tag("source", "bober_service")
                .tag("machine_id", "kruaccc")
                .register(meterRegistry);

        // Gauge for total output count
        Gauge.builder("machine.output.count", this, BoberService::getTotalOutputCount)
                .description("Total output unit count")
                .tag("source", "bober_service")
                .tag("machine_id", "kruaccc")
                .register(meterRegistry);
    }


    public void processAndSaveBoberData(String jsonBody) throws JsonProcessingException {
        // Parse the JSON string to JsonNode for manual extraction
        JsonNode rootNode = objectMapper.readTree(jsonBody);
        JsonNode telemetryNode = rootNode.get("telemetry");

        // Create and populate TelemetryData object
        TelemetryData telemetryData = new TelemetryData();
        telemetryData.setTimestamp(telemetryNode.get("timestamp").asText());
        telemetryData.setDatasource(telemetryNode.get("datasource").asText());
        telemetryData.setMachineid(telemetryNode.get("machineid").asText());
        telemetryData.setTotaloutputunitcount(telemetryNode.get("totaloutputunitcount").asInt());
        telemetryData.setMachineSpeed(telemetryNode.get("machineSpeed").asDouble());

        // Store the parsed data
        this.telemetryData = telemetryData;
    }

    private double getTotalOutputCount() {
        return telemetryData != null && telemetryData.getTotaloutputunitcount() != null
                ? telemetryData.getTotaloutputunitcount()
                : 0.0;
    }

    private double getMachineSpeed() {
        return telemetryData != null && telemetryData.getMachineSpeed() != null
                ? telemetryData.getMachineSpeed()
                : 0.0;
    }

}
