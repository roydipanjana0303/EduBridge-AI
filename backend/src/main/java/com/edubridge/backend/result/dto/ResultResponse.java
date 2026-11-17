package com.edubridge.backend.result.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ResultResponse(UUID id, UUID assessmentId, String assessmentTitle,
        BigDecimal obtainedMarks, BigDecimal totalMarks, String status, Instant submittedAt) {}
