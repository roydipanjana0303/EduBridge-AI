
package com.edubridge.backend.course.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.edubridge.backend.course.entity.Course;

public record CourseResponse(
    UUID id,
    String title,
    String description,
    String thumbnailUrl,
    UUID teacherId,
    String teacherName,
    boolean published,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static CourseResponse from(Course course) {
        return new CourseResponse(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getThumbnailUrl(),
            course.getTeacher().getId(),
            course.getTeacher().getName(),
            course.isPublished(),
            course.getCreatedAt(),
            course.getUpdatedAt()
        );
    }
}
