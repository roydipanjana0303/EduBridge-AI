package com.edubridge.auth;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity @Table(name="app_users", uniqueConstraints={@UniqueConstraint(columnNames="email")})
public class UserAccount implements UserDetails {
 @Id @GeneratedValue private UUID id;
 @Column(nullable=false,length=80) private String displayName;
 @Column(nullable=false,length=190,unique=true) private String email;
 @Column(nullable=false) private String passwordHash;
 @Column(nullable=false,length=24) private String role="STUDENT";
 @Column(nullable=false) private Instant createdAt=Instant.now();
 protected UserAccount() {}
 public UserAccount(String displayName,String email,String passwordHash,String role){this.displayName=displayName;this.email=email.toLowerCase();this.passwordHash=passwordHash;this.role=role;}
 public UUID getId(){return id;} public String getDisplayName(){return displayName;} public String getEmail(){return email;} public String getRole(){return role;} public Instant getCreatedAt(){return createdAt;}
 @Override public Collection<? extends GrantedAuthority> getAuthorities(){return List.of(new SimpleGrantedAuthority("ROLE_"+role));}
 @Override public String getPassword(){return passwordHash;} @Override public String getUsername(){return email;}
 @Override public boolean isAccountNonExpired(){return true;} @Override public boolean isAccountNonLocked(){return true;} @Override public boolean isCredentialsNonExpired(){return true;} @Override public boolean isEnabled(){return true;}
}
