package com.edubridge.backend.friend.dto;
import com.edubridge.backend.friend.entity.Friendship;
import java.time.OffsetDateTime;
import java.util.UUID;
public record FriendRequestResponse(UUID id,FriendUserResponse sender,FriendUserResponse receiver,String status,OffsetDateTime createdAt) {
 public static FriendRequestResponse from(Friendship f){return new FriendRequestResponse(f.getId(),
 new FriendUserResponse(f.getSender().getId(),f.getSender().getName(),f.getSender().getEmail(),f.getSender().getRole().name()),
 new FriendUserResponse(f.getReceiver().getId(),f.getReceiver().getName(),f.getReceiver().getEmail(),f.getReceiver().getRole().name()),
 f.getStatus().name(),f.getCreatedAt());}
}
