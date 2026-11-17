
package com.edubridge.backend.subject.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edubridge.backend.subject.dto.SubjectResponse;
import com.edubridge.backend.subject.service.SubjectService;

@RestController
@RequestMapping("/api/courses/{courseId}/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public List<SubjectResponse> getSubjectsByCourse(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal String email) {

        return subjectService.getSubjectsByCourse(courseId, email);
    }
}
