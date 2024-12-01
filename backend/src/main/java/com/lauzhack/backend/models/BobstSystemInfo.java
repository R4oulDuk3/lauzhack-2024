package com.lauzhack.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BobstSystemInfo {
	private String pythonVersion;
	private String osName;
	private String osSystem;
	private String osRelease;
	private String osVersion;
	private Integer cpuCountPhysical;
	private Integer cpuCountLogical;
	private Double cpuFreqCurrent;
	private Double totalRam;
	private Double diskTotal;
}