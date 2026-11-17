package com.edubridge.backend.assessment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "questions")
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;
    @Column(name = "question_type", nullable = false, length = 30)
    private String questionType;
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal marks;
    // Internal grading key; never expose through student DTOs.
    @Column(name = "correct_answer", columnDefinition = "TEXT")
    private String correctAnswer;
    @Column(nullable = false)
    private Integer position;
    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    private List<AssessmentOption> options = new ArrayList<>();
    public UUID getId() { return id; }
    public Assessment getAssessment() { return assessment; }
    public String getQuestionText() { return questionText; }
    public String getQuestionType() { return questionType; }
    public BigDecimal getMarks() { return marks; }
    public String getCorrectAnswer() { return correctAnswer; }
    public Integer getPosition() { return position; }
    public List<AssessmentOption> getOptions() { return options; }
}
