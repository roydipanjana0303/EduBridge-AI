
package com.edubridge.backend.subject.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.edubridge.backend.course.entity.Course;
import com.edubridge.backend.course.repository.CourseRepository;
import com.edubridge.backend.subject.dto.SubjectResponse;
import com.edubridge.backend.subject.repository.SubjectRepository;
import com.edubridge.backend.user.entity.Role;
import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public SubjectService(
            SubjectRepository subjectRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> getSubjectsByCourse(
            UUID courseId,
            String email) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found"
                ));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        boolean isAdmin = user.getRole() == Role.ADMIN;

        boolean isCourseTeacher =
                course.getTeacher().getId().equals(user.getId());

        boolean isPublished = course.isPublished();

        if (!isPublished && !isCourseTeacher && !isAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to view this course's subjects"
            );
        }

        return subjectRepository
                .findAllByCourse_IdOrderByCreatedAtAsc(courseId)
                .stream()
                .map(SubjectResponse::from)
                .toList();
    }
}
