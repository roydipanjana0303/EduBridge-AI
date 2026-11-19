package com.edubridge.voice;

import java.security.Principal;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class VoiceSignalController {

    private final SimpMessagingTemplate bus;

    public VoiceSignalController(SimpMessagingTemplate bus) {
        this.bus = bus;
    }

    @MessageMapping("/voice/{room}/signal")
    public void signal(@DestinationVariable String room, String payload, Principal principal) {
        bus.convertAndSend("/topic/voice/" + room, payload);
    }
}
