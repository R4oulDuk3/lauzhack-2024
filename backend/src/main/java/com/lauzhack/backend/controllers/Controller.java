package com.lauzhack.backend.controllers;

import com.lauzhack.backend.services.Service;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/test")
public class Controller {

    Service service;

    @GetMapping("/check")
    public ResponseEntity<Void> serviceCheck() {
        service.test();
        return ResponseEntity.ok().build();
    }

}

