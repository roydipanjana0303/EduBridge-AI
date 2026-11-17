
package com.edubridge.backend.progress.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProgressUpdateRequest(

        @NotNull
        List<String> completedTopics,

        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("100.0")
        BigDecimal progressPercentage

) {}
