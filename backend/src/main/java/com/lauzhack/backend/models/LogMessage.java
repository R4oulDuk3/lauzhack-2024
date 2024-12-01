package com.lauzhack.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogMessage {
	private String severity;
	private String message;
	private int timestamp;
}
