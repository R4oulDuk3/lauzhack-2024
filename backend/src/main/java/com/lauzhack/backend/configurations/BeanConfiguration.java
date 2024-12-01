package com.lauzhack.backend.configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lauzhack.backend.services.BoberService;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;



@Configuration
public class BeanConfiguration {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public MeterRegistry meterRegistry() {
        return new SimpleMeterRegistry();
    }

    @Bean
    public BoberService boberService(ObjectMapper objectMapper, MeterRegistry meterRegistry) {
        return new BoberService(objectMapper, meterRegistry);
    }
}