package com.edubridge.backend.assessment.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "assessment_options")
public class AssessmentOption {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;
    // Internal grading field; never expose through student DTOs.
    @Column(name = "is_correct", nullable = false)
    private boolean correct;
    @Column(nullable = false)
    private Integer position;
    public UUID getId() { return id; }
    public Question getQuestion() { return question; }
    public String getOptionText() { return optionText; }
    public boolean isCorrect() { return correct; }
    public Integer getPosition() { return position; }
}
