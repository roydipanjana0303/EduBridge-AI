package com.edubridge.auth;

import io.jsonwebtoken.Jwts; import io.jsonwebtoken.security.Keys; import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.time.Instant; import java.util.Date; import java.util.UUID; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
@Service public class JwtService {
 private final SecretKey key; private final long ttl;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.ttl-seconds:3600}") long ttl){if(secret==null||secret.length()<32)throw new IllegalStateException("APP_JWT_SECRET must contain at least 32 characters");this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.ttl=ttl;}
 public String issue(UserAccount user){Instant now=Instant.now();return Jwts.builder().subject(user.getEmail()).claim("uid",user.getId().toString()).claim("role",user.getRole()).issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(ttl))).signWith(key).compact();}
 public String subject(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
}
