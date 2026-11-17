package com.edubridge.backend.assessment.entity;

import com.edubridge.backend.subject.entity.Subject;
import com.edubridge.backend.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "assessments")
public class Assessment {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    @Column(nullable = false, length = 200)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "total_marks", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalMarks;
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    @Column(name = "is_published", nullable = false)
    private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    @OneToMany(mappedBy = "assessment", fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    private List<Question> questions = new ArrayList<>();
    @PrePersist protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (totalMarks == null) totalMarks = BigDecimal.ZERO;
    }
    public UUID getId() { return id; }
    public Subject getSubject() { return subject; }
    public User getCreatedBy() { return createdBy; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public BigDecimal getTotalMarks() { return totalMarks; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public boolean isPublished() { return published; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public List<Question> getQuestions() { return questions; }
}
