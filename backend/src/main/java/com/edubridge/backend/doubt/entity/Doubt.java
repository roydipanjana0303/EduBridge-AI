package com.edubridge.backend.doubt.entity;
import com.edubridge.backend.user.entity.User; import com.edubridge.backend.subject.entity.Subject; import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="doubts") public class Doubt {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="student_id",nullable=false) private User student;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="subject_id") private Subject subject;
 @Column(columnDefinition="text",nullable=false) private String question;
 @Column(columnDefinition="text") private String answer; private String status;
 @Column(name="created_at") private Instant createdAt; @Column(name="answered_at") private Instant answeredAt;
 public UUID getId(){return id;} public User getStudent(){return student;} public void setStudent(User v){student=v;}
 public Subject getSubject(){return subject;} public void setSubject(Subject v){subject=v;}
 public String getQuestion(){return question;} public void setQuestion(String v){question=v;} public String getAnswer(){return answer;} public void setAnswer(String v){answer=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;} public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
 public Instant getAnsweredAt(){return answeredAt;} public void setAnsweredAt(Instant v){answeredAt=v;}
}
