package com.edubridge.backend.roadmap.entity;
import com.edubridge.backend.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant; import java.util.UUID;
@Entity @Table(name="roadmaps")
public class Roadmap {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="student_id",nullable=false) private User student;
 @Column(name="career_goal",nullable=false) private String careerGoal;
 @Column(name="roadmap_data",columnDefinition="jsonb") @org.hibernate.annotations.ColumnTransformer(write="?::jsonb") private String roadmapData;
 @Column(name="created_at") private Instant createdAt;
 @Column(name="updated_at") private Instant updatedAt;
 public UUID getId(){return id;} public User getStudent(){return student;} public void setStudent(User v){student=v;}
 public String getCareerGoal(){return careerGoal;} public void setCareerGoal(String v){careerGoal=v;}
 public String getRoadmapData(){return roadmapData;} public void setRoadmapData(String v){roadmapData=v;}
 public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
 public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant v){updatedAt=v;}
}
