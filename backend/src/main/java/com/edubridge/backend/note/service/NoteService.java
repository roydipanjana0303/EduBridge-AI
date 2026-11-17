
package com.edubridge.backend.note.service;

import com.edubridge.backend.course.entity.Course;
import com.edubridge.backend.enrollment.repository.EnrollmentRepository;
import com.edubridge.backend.note.dto.NoteResponse;
import com.edubridge.backend.note.entity.Note;
import com.edubridge.backend.note.repository.NoteRepository;
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
public class NoteService {

    private final NoteRepository noteRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public NoteService(
            NoteRepository noteRepository,
            SubjectRepository subjectRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository) {
        this.noteRepository = noteRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesBySubject(
            UUID subjectId,
            String email) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subject not found"));

        User user = getUser(email);

        validateAccess(user, subject.getCourse());

        return noteRepository
                .findAllBySubject_IdOrderByCreatedAtDesc(subjectId)
                .stream()
                .map(NoteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(UUID noteId, String email) {

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Note not found"));

        User user = getUser(email);

        validateAccess(user, note.getSubject().getCourse());

        return NoteResponse.from(note);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    private void validateAccess(User user, Course course) {

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        boolean isTeacher =
                user.getRole() == Role.TEACHER
                && course.getTeacher().getId().equals(user.getId());

        if (isTeacher) {
            return;
        }

        boolean isStudent = user.getRole() == Role.STUDENT;

        boolean isEnrolled = isStudent
                && course.isPublished()
                && enrollmentRepository
                    .existsByStudent_IdAndCourse_IdAndStatus(
                        user.getId(),
                        course.getId(),
                        "ACTIVE"
                    );

        if (!isEnrolled) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to access these notes"
            );
        }
    }
}
