
package com.edubridge.backend.note.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edubridge.backend.note.entity.Note;

public interface NoteRepository extends JpaRepository<Note, UUID> {

    List<Note> findAllBySubject_IdOrderByCreatedAtDesc(UUID subjectId);

    List<Note> findAllByOrderByCreatedAtDesc();
}
