package com.edubridge.backend.reward.entity;
import com.edubridge.backend.user.entity.User; import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="rewards") public class Reward {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="student_id",nullable=false) private User student;
 private Integer points; private String reason; @Column(name="created_at") private Instant createdAt;
 public UUID getId(){return id;} public User getStudent(){return student;} public void setStudent(User v){student=v;}
 public Integer getPoints(){return points;} public void setPoints(Integer v){points=v;} public String getReason(){return reason;} public void setReason(String v){reason=v;}
 public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
}
