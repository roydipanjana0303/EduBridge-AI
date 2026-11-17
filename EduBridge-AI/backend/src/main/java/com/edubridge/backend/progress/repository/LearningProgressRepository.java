package com.edubridge.backend.progress.repository;
import com.edubridge.backend.progress.entity.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface LearningProgressRepository extends JpaRepository<LearningProgress, UUID> {
    List<LearningProgress> findAllByStudent_Id(UUID studentId);
    Optional<LearningProgress> findByStudent_IdAndSubject_Id(UUID studentId, UUID subjectId);
}
