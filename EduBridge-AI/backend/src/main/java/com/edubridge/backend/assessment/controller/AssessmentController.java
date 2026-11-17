package com.edubridge.backend.assessment.controller;

import com.edubridge.backend.assessment.dto.*;
import com.edubridge.backend.assessment.service.AssessmentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AssessmentController {
    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/subjects/{subjectId}/assessments")
    public List<AssessmentResponse> getAssessmentsBySubject(
            @PathVariable UUID subjectId, @AuthenticationPrincipal String email) {
        return assessmentService.getPublishedAssessmentsBySubject(subjectId, email);
    }

    @GetMapping("/assessments/{assessmentId}")
    public AssessmentResponse getAssessmentById(
            @PathVariable UUID assessmentId, @AuthenticationPrincipal String email) {
        return assessmentService.getAssessmentById(assessmentId, email);
    }

    @GetMapping("/assessments/{assessmentId}/questions")
    public List<QuestionResponse> getAssessmentQuestions(
            @PathVariable UUID assessmentId, @AuthenticationPrincipal String email) {
        return assessmentService.getAssessmentQuestions(assessmentId, email);
    }
}
