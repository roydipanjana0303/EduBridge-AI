package com.edubridge.backend.friend.dto;
import java.util.UUID;
public record FriendUserResponse(UUID id,String name,String email,String role) {}
