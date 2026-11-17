
package com.edubridge.backend.progress.service;

import com.edubridge.backend.progress.entity.LearningProgress;
import com.edubridge.backend.progress.repository.LearningProgressRepository;
import com.edubridge.backend.progress.dto.ProgressUpdateRequest;
import com.edubridge.backend.subject.repository.SubjectRepository;
import com.edubridge.backend.user.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class LearningProgressService {

    private final LearningProgressRepository progress;
    private final UserRepository users;
    private final SubjectRepository subjects;
    private final ObjectMapper mapper;

    public LearningProgressService(
            LearningProgressRepository progress,
            UserRepository users,
            SubjectRepository subjects,
            ObjectMapper mapper) {
        this.progress = progress;
        this.users = users;
        this.subjects = subjects;
        this.mapper = mapper;
    }

    @Transactional
    public LearningProgress update(
            UUID subjectId,
            String email,
            ProgressUpdateRequest req) {

        var user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED));

        var subject = subjects.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subject not found"));

        LearningProgress p = progress
                .findByStudent_IdAndSubject_Id(user.getId(), subjectId)
                .orElseGet(LearningProgress::new);

        p.setStudent(user);
        p.setSubject(subject);

        try {
            p.setCompletedTopics(
                    mapper.writeValueAsString(req.completedTopics()));
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid completed topics");
        }

        p.setProgressPercentage(req.progressPercentage());

        Instant now = Instant.now();
        p.setLastActivityAt(now);
        p.setUpdatedAt(now);

        return progress.save(p);
    }

    @Transactional(readOnly = true)
    public List<LearningProgress> mine(String email) {

        var user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED));

        return progress.findAllByStudent_Id(user.getId());
    }
}
