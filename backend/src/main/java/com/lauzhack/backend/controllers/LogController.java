package com.lauzhack.backend.controllers;

import com.lauzhack.backend.models.LogMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/logs")
@CrossOrigin()
@Slf4j
public class LogController {
	private final Queue<LogMessage> logQueue = new LinkedList<>();
	private static final int ONE_MINUTE_IN_SECONDS = 60;

	@PostMapping("/send")
	public ResponseEntity<Void> sendLogs(@RequestBody List<LogMessage> logs) {
		synchronized (logQueue) {
			logQueue.addAll(logs);
		}
		log.info("Received {} logs", logs.size());
		return ResponseEntity.ok().build();
	}

	@GetMapping("/pull/{count}")
	public ResponseEntity<List<LogMessage>> pullLogs(@PathVariable int count) {
		List<LogMessage> result;
		synchronized (logQueue) {
			// Purge old messages
			int currentTimestamp = (int) Instant.now().getEpochSecond();
			logQueue.removeIf(log ->
					(currentTimestamp - log.getTimestamp()) > ONE_MINUTE_IN_SECONDS
			);

			// Pull requested number of logs
			result = new ArrayList<>();
			for (int i = 0; i < count && !logQueue.isEmpty(); i++) {
				result.add(logQueue.poll());
			}
		}
		log.info("Pulled {} logs", result.size());
		return ResponseEntity.ok(result);
	}
}