
package com.edubridge.backend.note.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.edubridge.backend.note.entity.Note;

public record NoteResponse(
    UUID id,
    UUID subjectId,
    String subjectName,
    String title,
    String description,
    String fileUrl,
    String fileType,
    UUID uploadedById,
    String uploadedByName,
    OffsetDateTime createdAt
) {
    public static NoteResponse from(Note note) {
        return new NoteResponse(
            note.getId(),
            note.getSubject().getId(),
            note.getSubject().getName(),
            note.getTitle(),
            note.getDescription(),
            note.getFileUrl(),
            note.getFileType(),
            note.getUploadedBy().getId(),
            note.getUploadedBy().getName(),
            note.getCreatedAt()
        );
    }
}
