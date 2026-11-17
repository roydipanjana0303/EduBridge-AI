
package com.edubridge.backend.progress.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProgressResponse(
    UUID id,
    UUID subjectId,
    String subjectName,
    String completedTopics,
    BigDecimal progressPercentage,
    Instant lastActivityAt,
    Instant updatedAt
) {}
