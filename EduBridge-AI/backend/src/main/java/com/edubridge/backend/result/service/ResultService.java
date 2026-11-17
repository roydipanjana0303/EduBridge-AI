package com.edubridge.backend.result.service;

import com.edubridge.backend.assessment.entity.*;
import com.edubridge.backend.assessment.repository.*;
import com.edubridge.backend.enrollment.repository.EnrollmentRepository;
import com.edubridge.backend.result.dto.*;
import com.edubridge.backend.result.entity.*;
import com.edubridge.backend.result.repository.*;
import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class ResultService {
    private final UserRepository users;
    private final AssessmentRepository assessments;
    private final QuestionRepository questions;
    private final ResultRepository results;
    private final ResultAnswerRepository answers;
    private final EnrollmentRepository enrollments;

    public ResultService(UserRepository users, AssessmentRepository assessments, QuestionRepository questions,
            ResultRepository results, ResultAnswerRepository answers, EnrollmentRepository enrollments) {
        this.users = users; this.assessments = assessments; this.questions = questions;
        this.results = results; this.answers = answers; this.enrollments = enrollments;
    }

    @Transactional
    public ResultResponse submit(UUID assessmentId, String email, SubmitAssessmentRequest request) {
        User student = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        Assessment assessment = assessments.findById(assessmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));
        if (!assessment.isPublished()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found");
        UUID courseId = assessment.getSubject().getCourse().getId();
        if (!enrollments.existsByStudent_IdAndCourse_IdAndStatus(student.getId(), courseId, "ACTIVE"))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Active course enrollment required");
        if (results.findByAssessment_IdAndStudent_Id(assessmentId, student.getId()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Assessment has already been submitted");

        Map<UUID, SubmitAssessmentRequest.AnswerItem> submitted = new HashMap<>();
        for (var item : request.answers()) {
            if (item.questionId() == null || submitted.put(item.questionId(), item) != null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate or missing question ID");
        }
        List<Question> assessmentQuestions = questions.findAllByAssessment_IdOrderByPositionAsc(assessmentId);
        if (assessmentQuestions.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assessment has no questions");

        Result result = new Result();
        result.setAssessment(assessment); result.setStudent(student);
        result.setTotalMarks(assessment.getTotalMarks());
        result.setSubmittedAt(Instant.now()); result.setStatus("EVALUATED");
        BigDecimal total = BigDecimal.ZERO;
        List<ResultAnswer> pendingAnswers = new ArrayList<>();
        for (Question q : assessmentQuestions) {
            var item = submitted.get(q.getId());
            ResultAnswer answer = new ResultAnswer();
            answer.setResult(result); answer.setQuestion(q);
            boolean correct = false;
            if (item != null) {
                answer.setAnswerText(item.answerText());
                if (item.selectedOptionId() != null) {
                    AssessmentOption selected = q.getOptions().stream()
                        .filter(o -> o.getId().equals(item.selectedOptionId())).findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected option does not belong to question"));
                    answer.setSelectedOption(selected);
                    correct = selected.isCorrect();
                } else if (item.answerText() != null && q.getCorrectAnswer() != null) {
                    correct = q.getCorrectAnswer().trim().equalsIgnoreCase(item.answerText().trim());
                }
            }
            BigDecimal marks = correct ? q.getMarks() : BigDecimal.ZERO;
            answer.setCorrect(correct); answer.setMarksObtained(marks); total = total.add(marks);
            pendingAnswers.add(answer);
        }
        result.setObtainedMarks(total);
        Result saved = results.save(result);
        pendingAnswers.forEach(a -> a.setResult(saved));
        answers.saveAll(pendingAnswers);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ResultResponse> myResults(String email) {
        User student = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return results.findAllByStudent_IdOrderBySubmittedAtDesc(student.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ResultResponse getMyResult(UUID id, String email) {
        User student = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        Result r = results.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Result not found"));
        if (!r.getStudent().getId().equals(student.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your result");
        return toResponse(r);
    }

    private ResultResponse toResponse(Result r) {
        return new ResultResponse(r.getId(), r.getAssessment().getId(), r.getAssessment().getTitle(),
                r.getObtainedMarks(), r.getTotalMarks(), r.getStatus(), r.getSubmittedAt());
    }
}
