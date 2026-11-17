
package com.edubridge.backend.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edubridge.backend.auth.dto.AuthResponse;
import com.edubridge.backend.auth.dto.LoginRequest;
import com.edubridge.backend.auth.dto.RegisterRequest;
import com.edubridge.backend.auth.dto.UserResponse;
import com.edubridge.backend.auth.service.AuthService;
import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
            authService.login(request)
        );
    }

    /**
     * GET /api/auth/me — returns the currently authenticated user's profile.
     * Requires a valid JWT Bearer token in the Authorization header.
     */
    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));
        return UserResponse.from(user);
    }
}
