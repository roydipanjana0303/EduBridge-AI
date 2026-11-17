
package com.edubridge.backend.auth.dto;

public record AuthResponse(
    String accessToken,
    String tokenType,
    UserResponse user
) {}
