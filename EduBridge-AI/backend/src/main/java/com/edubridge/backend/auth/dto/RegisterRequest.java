
package com.edubridge.backend.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Registration request DTO.
 * Accepts both "name" and "displayName" from the frontend.
 */
public record RegisterRequest(

    @JsonAlias("displayName")
    @NotBlank(message = "Name is required")
    @Size(max = 120)
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    @Size(max = 180)
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 72)
    String password,

    // Role is accepted but ignored for public registration (always STUDENT)
    String role

) {}
