package com.edubridge.chat;

import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.security.Principal;
import java.time.Instant;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final UserRepository users;
    private final ServerRepository servers;
    private final ChannelRepository channels;
    private final MessageRepository messages;
    private final SimpMessagingTemplate bus;

    public ChatController(UserRepository u, ServerRepository s, ChannelRepository c, MessageRepository m, SimpMessagingTemplate b) {
        users = u;
        servers = s;
        channels = c;
        messages = m;
        bus = b;
    }

    public record CreateServer(@NotBlank @Size(max = 80) String name, @Size(max = 300) String description) {}
    public record CreateChannel(@NotBlank @Size(max = 80) String name, @Pattern(regexp = "TEXT|VOICE|ANNOUNCEMENT|FORUM") String type) {}
    public record SendMessage(@NotBlank @Size(max = 4000) String content) {}
    public record ServerDto(String id, String name, String description, List<ChannelDto> channels) {}
    public record ChannelDto(String id, String name, String type) {}
    public record MessageDto(String id, String channelId, String senderId, String senderName, String content, Instant createdAt, Instant editedAt) {}

    private User user(Principal p) {
        return users.findByEmailIgnoreCase(p.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    @GetMapping("/servers")
    public List<ServerDto> list(Principal p) {
        return servers.findAll().stream().map(this::dto).toList();
    }

    @PostMapping("/servers")
    public ServerDto create(@Valid @RequestBody CreateServer r, Principal p) {
        var u = user(p);
        var s = servers.save(new CommunityServer(r.name().trim(), r.description(), u));
        channels.save(new ChatChannel(s, "general", "TEXT"));
        channels.save(new ChatChannel(s, "General Voice", "VOICE"));
        return dto(s);
    }

    @PostMapping("/servers/{id}/channels")
    public ChannelDto channel(@PathVariable UUID id, @Valid @RequestBody CreateChannel r, Principal p) {
        var s = servers.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user(p); // Verify authenticated user
        var c = channels.save(new ChatChannel(s, r.name().trim(), r.type() == null ? "TEXT" : r.type()));
        return cdto(c);
    }

    @GetMapping("/channels/{id}/messages")
    public List<MessageDto> history(@PathVariable UUID id, Principal p) {
        var c = channels.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return messages.findTop50ByChannel_IdOrderByCreatedAtDesc(id).stream().sorted(Comparator.comparing(ChatMessage::getCreatedAt)).map(this::mdto).toList();
    }

    @PostMapping("/channels/{id}/messages")
    public MessageDto send(@PathVariable UUID id, @Valid @RequestBody SendMessage r, Principal p) {
        var c = channels.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var m = messages.save(new ChatMessage(c, user(p), r.content().trim()));
        var dto = mdto(m);
        bus.convertAndSend("/topic/channels/" + id, dto);
        return dto;
    }

    @DeleteMapping("/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Principal p) {
        var m = messages.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!m.getSender().getEmail().equalsIgnoreCase(p.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        messages.delete(m);
    }

    private ServerDto dto(CommunityServer s) {
        return new ServerDto(s.getId().toString(), s.getName(), s.getDescription(), channels.findByServerId(s.getId()).stream().map(this::cdto).toList());
    }

    private ChannelDto cdto(ChatChannel c) {
        return new ChannelDto(c.getId().toString(), c.getName(), c.getType());
    }

    private MessageDto mdto(ChatMessage m) {
        return new MessageDto(m.getId().toString(), m.getChannel().getId().toString(), m.getSender().getId().toString(), m.getSender().getDisplayName(), m.getContent(), m.getCreatedAt(), m.getEditedAt());
    }
}
