
package com.edubridge.backend.note.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edubridge.backend.note.dto.NoteResponse;
import com.edubridge.backend.note.service.NoteService;

@RestController
@RequestMapping("/api")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/subjects/{subjectId}/notes")
    public List<NoteResponse> getNotesBySubject(
            @PathVariable UUID subjectId,
            @AuthenticationPrincipal String email) {

        return noteService.getNotesBySubject(subjectId, email);
    }

    @GetMapping("/notes/{noteId}")
    public NoteResponse getNoteById(
            @PathVariable UUID noteId,
            @AuthenticationPrincipal String email) {

        return noteService.getNoteById(noteId, email);
    }
}
