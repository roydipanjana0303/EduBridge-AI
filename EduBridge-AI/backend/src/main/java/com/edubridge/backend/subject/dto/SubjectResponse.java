
package com.edubridge.backend.subject.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.edubridge.backend.subject.entity.Subject;

public record SubjectResponse(
    UUID id,
    UUID courseId,
    String name,
    String description,
    OffsetDateTime createdAt
) {
    public static SubjectResponse from(Subject subject) {
        return new SubjectResponse(
            subject.getId(),
            subject.getCourse().getId(),
            subject.getName(),
            subject.getDescription(),
            subject.getCreatedAt()
        );
    }
}
