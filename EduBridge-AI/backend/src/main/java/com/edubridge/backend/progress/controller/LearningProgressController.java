
package com.edubridge.backend.progress.controller;

import com.edubridge.backend.progress.dto.ProgressUpdateRequest;
import com.edubridge.backend.progress.dto.ProgressResponse;
import com.edubridge.backend.progress.entity.LearningProgress;
import com.edubridge.backend.progress.service.LearningProgressService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
public class LearningProgressController {

    private final LearningProgressService service;

    public LearningProgressController(LearningProgressService service) {
        this.service = service;
    }

    @GetMapping("/my")
    public List<ProgressResponse> mine(Authentication auth) {
        return service.mine(auth.getName())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PutMapping("/subjects/{subjectId}")
    public ProgressResponse update(
            @PathVariable UUID subjectId,
            @Valid @RequestBody ProgressUpdateRequest req,
            Authentication auth) {

        LearningProgress progress =
                service.update(subjectId, auth.getName(), req);

        return toResponse(progress);
    }

    private ProgressResponse toResponse(LearningProgress progress) {
        return new ProgressResponse(
                progress.getId(),
                progress.getSubject().getId(),
                progress.getSubject().getName(),
                progress.getCompletedTopics(),
                progress.getProgressPercentage(),
                progress.getLastActivityAt(),
                progress.getUpdatedAt()
        );
    }
}
