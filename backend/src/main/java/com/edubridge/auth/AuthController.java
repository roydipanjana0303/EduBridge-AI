package com.edubridge.auth;

import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.http.*; import org.springframework.security.authentication.*; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/auth") public class AuthController {
 private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager auth; private final JwtService jwt;
 public AuthController(UserRepository users,PasswordEncoder encoder,AuthenticationManager auth,JwtService jwt){this.users=users;this.encoder=encoder;this.auth=auth;this.jwt=jwt;}
 public record RegisterRequest(@NotBlank @Size(min=2,max=80) String displayName,@NotBlank @Email String email,@NotBlank @Size(min=10,max=128) String password,@Pattern(regexp="STUDENT|MENTOR") String role){}
 public record LoginRequest(@NotBlank @Email String email,@NotBlank String password){}
 public record AuthResponse(String token,UserDto user){} public record UserDto(String id,String displayName,String email,String role){}
 @PostMapping("/register") public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest r){if(users.existsByEmailIgnoreCase(r.email()))return ResponseEntity.status(409).build();var u=users.save(new UserAccount(r.displayName().trim(),r.email().trim(),encoder.encode(r.password()),"STUDENT"));return ResponseEntity.status(201).body(response(u));}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r){try{auth.authenticate(new UsernamePasswordAuthenticationToken(r.email().toLowerCase(),r.password()));}catch(org.springframework.security.core.AuthenticationException ex){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");}return response(users.findByEmailIgnoreCase(r.email()).orElseThrow());}
 @GetMapping("/me") public UserDto me(java.security.Principal p){var u=users.findByEmailIgnoreCase(p.getName()).orElseThrow();return dto(u);}
 private AuthResponse response(UserAccount u){return new AuthResponse(jwt.issue(u),dto(u));} private UserDto dto(UserAccount u){return new UserDto(u.getId().toString(),u.getDisplayName(),u.getEmail(),u.getRole());}
}
