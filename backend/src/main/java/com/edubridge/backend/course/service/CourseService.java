
package com.edubridge.backend.course.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.edubridge.backend.course.dto.CourseRequest;
import com.edubridge.backend.course.dto.CourseResponse;
import com.edubridge.backend.course.entity.Course;
import com.edubridge.backend.course.repository.CourseRepository;
import com.edubridge.backend.user.entity.Role;
import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(
        CourseRepository courseRepository,
        UserRepository userRepository
    ) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CourseResponse createCourse(
        CourseRequest request,
        String email
    ) {
        User teacher = getUser(email);

        if (teacher.getRole() != Role.TEACHER
                && teacher.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only teachers and admins can create courses"
            );
        }

        Course course = new Course();
        course.setTitle(request.title().trim());
        course.setDescription(request.description());
        course.setThumbnailUrl(request.thumbnailUrl());
        course.setPublished(
            Boolean.TRUE.equals(request.published())
        );
        course.setTeacher(teacher);

        return CourseResponse.from(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPublishedCourses() {
        return courseRepository
            .findAllByPublishedTrueOrderByCreatedAtDesc()
            .stream()
            .map(CourseResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(String email) {
        return courseRepository
            .findAllByTeacher_EmailOrderByCreatedAtDesc(email)
            .stream()
            .map(CourseResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(UUID id, String email) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Course not found"
            ));

        boolean isOwner = course.getTeacher()
            .getEmail().equalsIgnoreCase(email);

        boolean isAdmin = getUser(email).getRole() == Role.ADMIN;

        if (!course.isPublished() && !isOwner && !isAdmin) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Course not found"
            );
        }

        return CourseResponse.from(course);
    }

    @Transactional
    public CourseResponse updateCourse(
        UUID id,
        CourseRequest request,
        String email
    ) {
        Course course = getCourseForOwnerOrAdmin(id, email);

        course.setTitle(request.title().trim());
        course.setDescription(request.description());
        course.setThumbnailUrl(request.thumbnailUrl());

        if (request.published() != null) {
            course.setPublished(request.published());
        }

        return CourseResponse.from(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(UUID id, String email) {
        Course course = getCourseForOwnerOrAdmin(id, email);
        courseRepository.delete(course);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"
            ));
    }

    private Course getCourseForOwnerOrAdmin(
        UUID id,
        String email
    ) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Course not found"
            ));

        boolean isOwner = course.getTeacher()
            .getEmail().equalsIgnoreCase(email);

        boolean isAdmin = getUser(email).getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not allowed to manage this course"
            );
        }

        return course;
    }
}
