package com.edubridge.backend.assessment.repository;

import com.edubridge.backend.assessment.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {
    List<Assessment> findAllBySubject_IdAndPublishedTrueOrderByCreatedAtDesc(UUID subjectId);
}
