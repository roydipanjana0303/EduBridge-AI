
package com.edubridge.backend.auth.dto;

import java.util.UUID;

import com.edubridge.backend.user.entity.Role;
import com.edubridge.backend.user.entity.User;

public record UserResponse(
    UUID id,
    String name,
    String email,
    Role role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }
}
