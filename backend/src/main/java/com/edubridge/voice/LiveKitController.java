package com.edubridge.voice;

import com.edubridge.backend.user.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.Instant;
import java.util.*;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/voice")
public class LiveKitController {
    private final UserRepository users;
    private final String url, key, secret;

    public LiveKitController(UserRepository u, @Value("${livekit.url:}") String url, @Value("${livekit.api-key:}") String key, @Value("${livekit.api-secret:}") String secret) {
        users = u;
        this.url = url;
        this.key = key;
        this.secret = secret;
    }

    public record TokenRequest(String room) {}
    public record TokenResponse(String url, String token) {}

    @PostMapping("/token")
    public TokenResponse token(@RequestBody TokenRequest r, Principal p) {
        String rawRoom = r.room() == null ? "general" : r.room().trim();
        String room = rawRoom.replaceAll("[^A-Za-z0-9_-]", "-");
        if (room.length() < 2) {
            room = "room-" + (room.isEmpty() ? "study" : room);
        }
        if (room.length() > 80) {
            room = room.substring(0, 80);
        }
        var u = users.findByEmailIgnoreCase(p.getName()).orElseThrow();
        if (url.isBlank() || key.isBlank() || secret.length() < 32) {
            // Built-in WebRTC mode: return local mesh identifier
            return new TokenResponse("webrtc-mesh", u.getId().toString() + ":" + u.getDisplayName());
        }
        Instant now = Instant.now();
        SecretKey sk = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        String jwt = Jwts.builder().header().add("typ", "JWT").and().issuer(key).subject(u.getId().toString()).claim("name", u.getDisplayName()).claim("video", Map.of("roomJoin", true, "room", room, "canPublish", true, "canSubscribe", true, "canPublishData", true)).issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(3600))).signWith(sk).compact();
        return new TokenResponse(url, jwt);
    }
}
