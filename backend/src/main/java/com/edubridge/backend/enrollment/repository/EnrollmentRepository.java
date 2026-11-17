
package com.edubridge.backend.enrollment.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edubridge.backend.enrollment.entity.Enrollment;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, UUID> {

    boolean existsByStudent_IdAndCourse_IdAndStatus(
        UUID studentId,
        UUID courseId,
        String status
    );
}
