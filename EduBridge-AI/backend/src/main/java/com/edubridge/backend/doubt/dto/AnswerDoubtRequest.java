package com.edubridge.backend.doubt.dto;
import jakarta.validation.constraints.NotBlank;
public record AnswerDoubtRequest(@NotBlank String answer) {}
