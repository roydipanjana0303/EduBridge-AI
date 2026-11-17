package com.edubridge.backend.result.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public record SubmitAssessmentRequest(@NotEmpty List<@Valid AnswerItem> answers) {
    public record AnswerItem(UUID questionId, UUID selectedOptionId, String answerText) {}
}
