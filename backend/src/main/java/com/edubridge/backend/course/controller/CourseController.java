
package com.edubridge.backend.course.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edubridge.backend.course.dto.CourseRequest;
import com.edubridge.backend.course.dto.CourseResponse;
import com.edubridge.backend.course.service.CourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Create a course
    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
        @Valid @RequestBody CourseRequest request,
        @AuthenticationPrincipal String email
    ) {
        CourseResponse response =
            courseService.createCourse(request, email);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Get all published courses
    @GetMapping
    public ResponseEntity<List<CourseResponse>> getPublishedCourses() {
        return ResponseEntity.ok(
            courseService.getPublishedCourses()
        );
    }

    // Get courses created by the logged-in teacher
    @GetMapping("/my")
    public ResponseEntity<List<CourseResponse>> getMyCourses(
        @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.ok(
            courseService.getMyCourses(email)
        );
    }

    // Get course by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(
        @PathVariable UUID id,
        @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.ok(
            courseService.getCourseById(id, email)
        );
    }

    // Update a course
    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
        @PathVariable UUID id,
        @Valid @RequestBody CourseRequest request,
        @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.ok(
            courseService.updateCourse(id, request, email)
        );
    }

    // Delete a course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
        @PathVariable UUID id,
        @AuthenticationPrincipal String email
    ) {
        courseService.deleteCourse(id, email);

        return ResponseEntity.noContent().build();
    }
}
