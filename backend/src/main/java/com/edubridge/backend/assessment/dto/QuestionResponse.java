package com.edubridge.backend.assessment.dto;

import com.edubridge.backend.assessment.entity.Question;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record QuestionResponse(
    UUID id, String questionText, String questionType, BigDecimal marks,
    Integer position, List<AssessmentOptionResponse> options
) {
    public static QuestionResponse from(Question q) {
        return new QuestionResponse(q.getId(), q.getQuestionText(), q.getQuestionType(),
            q.getMarks(), q.getPosition(),
            q.getOptions().stream().map(AssessmentOptionResponse::from).toList());
    }
}
