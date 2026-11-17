
package com.edubridge.backend.subject.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edubridge.backend.subject.entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    List<Subject> findAllByCourse_IdOrderByCreatedAtAsc(UUID courseId);

    long countByCourse_Id(UUID courseId);
}
