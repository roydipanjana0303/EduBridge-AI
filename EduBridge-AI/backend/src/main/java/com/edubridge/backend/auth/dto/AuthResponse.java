
package com.edubridge.backend.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Authentication response — contains the JWT and user info.
 * Both `accessToken` and `token` fields are serialised so that
 * old and new frontend code can read the JWT regardless of field name.
 */
public record AuthResponse(
    String accessToken,
    String tokenType,
    UserResponse user
) {
    /** Alias: some frontend versions read "token" instead of "accessToken". */
    @JsonProperty("token")
    public String token() {
        return accessToken;
    }
}
