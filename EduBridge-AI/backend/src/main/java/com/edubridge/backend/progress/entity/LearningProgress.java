
package com.edubridge.backend.progress.entity;

import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.subject.entity.Subject;

import jakarta.persistence.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "learning_progress",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"student_id", "subject_id"}
    )
)
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "completed_topics", columnDefinition = "jsonb")
    private String completedTopics = "[]";

    @Column(name = "progress_percentage", columnDefinition = "NUMERIC")
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(name = "last_activity_at")
    private Instant lastActivityAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public UUID getId() {
        return id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public String getCompletedTopics() {
        return completedTopics;
    }

    public void setCompletedTopics(String completedTopics) {
        this.completedTopics = completedTopics;
    }

    public BigDecimal getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(BigDecimal progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Instant getLastActivityAt() {
        return lastActivityAt;
    }

    public void setLastActivityAt(Instant lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
