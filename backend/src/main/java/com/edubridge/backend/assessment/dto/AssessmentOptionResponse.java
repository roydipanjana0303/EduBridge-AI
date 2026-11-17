package com.edubridge.backend.assessment.dto;

import com.edubridge.backend.assessment.entity.AssessmentOption;
import java.util.UUID;

public record AssessmentOptionResponse(UUID id, String optionText, Integer position) {
    public static AssessmentOptionResponse from(AssessmentOption option) {
        return new AssessmentOptionResponse(option.getId(), option.getOptionText(), option.getPosition());
    }
}
