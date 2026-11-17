package com.edubridge.backend.assessment.dto;

import com.edubridge.backend.assessment.entity.Assessment;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AssessmentResponse(
    UUID id, UUID subjectId, String subjectName, String title,
    String description, BigDecimal totalMarks, Integer durationMinutes,
    boolean published, OffsetDateTime createdAt
) {
    public static AssessmentResponse from(Assessment a) {
        return new AssessmentResponse(a.getId(), a.getSubject().getId(),
            a.getSubject().getName(), a.getTitle(), a.getDescription(),
            a.getTotalMarks(), a.getDurationMinutes(), a.isPublished(),
            a.getCreatedAt());
    }
}
