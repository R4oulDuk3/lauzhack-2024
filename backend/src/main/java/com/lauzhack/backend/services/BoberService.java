package com.lauzhack.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lauzhack.backend.models.ConfigData;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.Getter;

public class BoberService {

    // Getter method to access the stored data if needed
    @Getter
    private ConfigData configData;



    public BoberService() {
        configData = ConfigData.builder()
                .speed(10)
                .power("on")
                .build();
    }


    public void processAndSaveBoberData(ConfigData data) {

        this.configData = data;
    }

}
