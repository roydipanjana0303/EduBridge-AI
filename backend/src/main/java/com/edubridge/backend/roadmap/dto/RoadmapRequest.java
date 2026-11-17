package com.edubridge.backend.roadmap.dto;

import jakarta.validation.constraints.NotBlank;
import tools.jackson.databind.JsonNode;
public record RoadmapRequest(@NotBlank String careerGoal, JsonNode roadmapData) {
}
