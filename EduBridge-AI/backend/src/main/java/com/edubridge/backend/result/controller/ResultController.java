package com.edubridge.backend.result.controller;

import com.edubridge.backend.result.dto.*;
import com.edubridge.backend.result.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ResultController {
    private final ResultService service;
    public ResultController(ResultService service) { this.service = service; }

    @PostMapping("/assessments/{assessmentId}/submit")
    public ResultResponse submit(@PathVariable UUID assessmentId, @Valid @RequestBody SubmitAssessmentRequest request,
                                 org.springframework.security.core.Authentication authentication) {
        return service.submit(assessmentId, authentication.getName(), request);
    }

    @GetMapping("/results/my")
    public List<ResultResponse> myResults(org.springframework.security.core.Authentication authentication) {
        return service.myResults(authentication.getName());
    }

    @GetMapping("/results/{resultId}")
    public ResultResponse result(@PathVariable UUID resultId, org.springframework.security.core.Authentication authentication) {
        return service.getMyResult(resultId, authentication.getName());
    }
}
