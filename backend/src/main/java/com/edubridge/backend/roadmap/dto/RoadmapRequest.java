package com.edubridge.backend.roadmap.dto;

import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.databind.JsonNode;
public record RoadmapRequest(@NotBlank String careerGoal, JsonNode roadmapData) {
}
