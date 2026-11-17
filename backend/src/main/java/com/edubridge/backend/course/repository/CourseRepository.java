
package com.edubridge.backend.course.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edubridge.backend.course.entity.Course;

public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findAllByPublishedTrueOrderByCreatedAtDesc();

    List<Course> findAllByTeacher_EmailOrderByCreatedAtDesc(String email);

    Optional<Course> findByIdAndTeacher_Email(UUID id, String email);

    Optional<Course> findByIdAndPublishedTrue(UUID id);
}
