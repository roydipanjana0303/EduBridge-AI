package com.edubridge.backend.result.entity;

import com.edubridge.backend.assessment.entity.Question;
import com.edubridge.backend.assessment.entity.AssessmentOption;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "result_answers")
public class ResultAnswer {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "result_id", nullable = false)
    private Result result;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "selected_option_id")
    private AssessmentOption selectedOption;
    @Column(name = "answer_text", columnDefinition = "text")
    private String answerText;
    @Column(name = "is_correct")
    private Boolean correct;
    @Column(name = "marks_obtained", precision = 8, scale = 2)
    private BigDecimal marksObtained;

    public UUID getId() { return id; }
    public Result getResult() { return result; }
    public void setResult(Result value) { result = value; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question value) { question = value; }
    public AssessmentOption getSelectedOption() { return selectedOption; }
    public void setSelectedOption(AssessmentOption value) { selectedOption = value; }
    public String getAnswerText() { return answerText; }
    public void setAnswerText(String value) { answerText = value; }
    public Boolean getCorrect() { return correct; }
    public void setCorrect(Boolean value) { correct = value; }
    public BigDecimal getMarksObtained() { return marksObtained; }
    public void setMarksObtained(BigDecimal value) { marksObtained = value; }
}
