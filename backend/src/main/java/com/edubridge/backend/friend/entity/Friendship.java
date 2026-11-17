package com.edubridge.backend.friend.entity;
import com.edubridge.backend.user.entity.User;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity @Table(name="friendships")
public class Friendship {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="sender_id",nullable=false) private User sender;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="receiver_id",nullable=false) private User receiver;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private FriendshipStatus status=FriendshipStatus.PENDING;
 @Column(name="created_at",nullable=false,updatable=false) private OffsetDateTime createdAt;
 @Column(name="updated_at",nullable=false) private OffsetDateTime updatedAt;
 @PrePersist void create(){var n=OffsetDateTime.now();createdAt=n;updatedAt=n;}
 @PreUpdate void update(){updatedAt=OffsetDateTime.now();}
 public UUID getId(){return id;} public User getSender(){return sender;} public void setSender(User v){sender=v;}
 public User getReceiver(){return receiver;} public void setReceiver(User v){receiver=v;}
 public FriendshipStatus getStatus(){return status;} public void setStatus(FriendshipStatus v){status=v;}
 public OffsetDateTime getCreatedAt(){return createdAt;} public OffsetDateTime getUpdatedAt(){return updatedAt;}
}
