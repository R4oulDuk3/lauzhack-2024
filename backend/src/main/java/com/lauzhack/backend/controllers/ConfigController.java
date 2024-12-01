package com.lauzhack.backend.controllers;


import com.lauzhack.backend.models.ConfigData;
import com.lauzhack.backend.services.BoberService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/config")
@CrossOrigin()
@Slf4j
public class ConfigController {

	BoberService boberService;

	@GetMapping
	public ResponseEntity<ConfigData> getBoberData() {
		ConfigData data = boberService.getConfigData();
		if (data != null) {
			return ResponseEntity.ok(data);
		}
		return ResponseEntity.notFound().build();
	}

	@PostMapping
	public ResponseEntity<String> processBoberData(@RequestBody ConfigData data) {
		try {
			boberService.processAndSaveBoberData(data);
			return ResponseEntity.ok("Data processed successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error processing data: " + e.getMessage());
		}
	}
}
