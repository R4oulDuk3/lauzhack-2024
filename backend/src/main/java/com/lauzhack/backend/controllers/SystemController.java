package com.lauzhack.backend.controllers;

import com.lauzhack.backend.models.BobstSystemInfo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin()
@Slf4j
public class SystemController {


	private BobstSystemInfo info;

	public SystemController(){
		info = null;
	}

	@GetMapping("/info")
	public ResponseEntity<?> getSystemInfo() {
		log.info("GET /api/v1/system/info");

		if (info == null){
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(info);
	}

	@PostMapping("/info")
	public ResponseEntity<Void> setSystemInfo(@RequestBody BobstSystemInfo info) {
		log.info("POST /api/v1/system/info with info: {}", info.getOsSystem());
		this.info = info;
		return ResponseEntity.ok().build();
	}


}
