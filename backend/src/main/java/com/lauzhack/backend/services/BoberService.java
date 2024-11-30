package com.lauzhack.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lauzhack.backend.models.TelemetryData;
import lombok.Getter;

public class BoberService {

    // Getter method to access the stored data if needed
    @Getter
    private TelemetryData localBoberData;

    private final ObjectMapper objectMapper;

    public BoberService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
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
        this.localBoberData = telemetryData;
    }

}
