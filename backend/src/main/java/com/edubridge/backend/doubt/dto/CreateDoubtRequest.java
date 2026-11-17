package com.edubridge.backend.doubt.dto;
import jakarta.validation.constraints.NotBlank; import java.util.UUID;
public record CreateDoubtRequest(UUID subjectId,@NotBlank String question) {}
