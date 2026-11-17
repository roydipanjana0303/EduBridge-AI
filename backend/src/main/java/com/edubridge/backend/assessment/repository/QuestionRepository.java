package com.edubridge.backend.assessment.repository;

import com.edubridge.backend.assessment.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findAllByAssessment_IdOrderByPositionAsc(UUID assessmentId);
}
