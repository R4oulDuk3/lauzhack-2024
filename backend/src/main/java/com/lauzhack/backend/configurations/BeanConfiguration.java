package com.lauzhack.backend.configurations;

import com.lauzhack.backend.services.Service;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public Service service() {
        return new Service();
    }
}
