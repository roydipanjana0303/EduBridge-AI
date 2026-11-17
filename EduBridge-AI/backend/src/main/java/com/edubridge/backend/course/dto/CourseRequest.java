
package com.edubridge.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CourseRequest(

    @NotBlank(message = "Course title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    String title,

    String description,

    String thumbnailUrl,

    Boolean published

) {}
