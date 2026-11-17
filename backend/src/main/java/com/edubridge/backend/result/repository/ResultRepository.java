package com.edubridge.backend.result.repository;

import com.edubridge.backend.result.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ResultRepository extends JpaRepository<Result, UUID> {
    List<Result> findAllByStudent_IdOrderBySubmittedAtDesc(UUID studentId);
    Optional<Result> findByAssessment_IdAndStudent_Id(UUID assessmentId, UUID studentId);
}
