package com.edubridge.backend.assessment.service;

import com.edubridge.backend.assessment.dto.*;
import com.edubridge.backend.assessment.entity.Assessment;
import com.edubridge.backend.assessment.repository.*;
import com.edubridge.backend.course.entity.Course;
import com.edubridge.backend.enrollment.repository.EnrollmentRepository;
import com.edubridge.backend.subject.entity.Subject;
import com.edubridge.backend.subject.repository.SubjectRepository;
import com.edubridge.backend.user.entity.Role;
import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@Service
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AssessmentService(AssessmentRepository assessmentRepository,
            QuestionRepository questionRepository, SubjectRepository subjectRepository,
            UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<AssessmentResponse> getPublishedAssessmentsBySubject(UUID subjectId, String email) {
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));
        User user = getUser(email);
        validateCourseAccess(user, subject.getCourse());
        return assessmentRepository.findAllBySubject_IdAndPublishedTrueOrderByCreatedAtDesc(subjectId)
            .stream().map(AssessmentResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AssessmentResponse getAssessmentById(UUID assessmentId, String email) {
        Assessment a = getAssessment(assessmentId);
        User user = getUser(email);
        validateCourseAccess(user, a.getSubject().getCourse());
        ensurePublishedOrOwner(a, user);
        return AssessmentResponse.from(a);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getAssessmentQuestions(UUID assessmentId, String email) {
        Assessment a = getAssessment(assessmentId);
        User user = getUser(email);
        validateCourseAccess(user, a.getSubject().getCourse());
        ensurePublishedOrOwner(a, user);
        // Correct answer and is_correct are intentionally excluded from response DTOs.
        return questionRepository.findAllByAssessment_IdOrderByPositionAsc(assessmentId)
            .stream().map(QuestionResponse::from).toList();
    }

    private Assessment getAssessment(UUID id) {
        return assessmentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensurePublishedOrOwner(Assessment a, User user) {
        boolean ownerTeacher = user.getRole() == Role.TEACHER
            && a.getSubject().getCourse().getTeacher().getId().equals(user.getId());
        if (!a.isPublished() && user.getRole() != Role.ADMIN && !ownerTeacher) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found");
        }
    }

    private void validateCourseAccess(User user, Course course) {
        if (user.getRole() == Role.ADMIN) return;

        boolean ownerTeacher = user.getRole() == Role.TEACHER
            && course.getTeacher().getId().equals(user.getId());
        if (ownerTeacher) return;

        boolean enrolledStudent = user.getRole() == Role.STUDENT && course.isPublished()
            && enrollmentRepository.existsByStudent_IdAndCourse_IdAndStatus(
                user.getId(), course.getId(), "ACTIVE");

        if (!enrolledStudent) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You do not have permission to access this assessment");
        }
    }
}
