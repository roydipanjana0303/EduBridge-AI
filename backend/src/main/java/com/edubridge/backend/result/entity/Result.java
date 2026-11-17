package com.edubridge.backend.result.entity;

import com.edubridge.backend.assessment.entity.Assessment;
import com.edubridge.backend.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "results", uniqueConstraints = @UniqueConstraint(columnNames = {"assessment_id", "student_id"}))
public class Result {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false)
    private User student;
    @Column(name = "obtained_marks", precision = 8, scale = 2)
    private BigDecimal obtainedMarks;
    @Column(name = "total_marks", precision = 8, scale = 2)
    private BigDecimal totalMarks;
    @Column(name = "submitted_at")
    private Instant submittedAt;
    private String status;

    public UUID getId() { return id; }
    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public BigDecimal getObtainedMarks() { return obtainedMarks; }
    public void setObtainedMarks(BigDecimal value) { this.obtainedMarks = value; }
    public BigDecimal getTotalMarks() { return totalMarks; }
    public void setTotalMarks(BigDecimal value) { this.totalMarks = value; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant value) { this.submittedAt = value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { this.status = value; }
}
