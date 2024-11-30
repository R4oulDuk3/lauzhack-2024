package com.lauzhack.backend.models;

import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@AllArgsConstructor
@Data
public class BoberInputJson {
    private String inputJson;
}