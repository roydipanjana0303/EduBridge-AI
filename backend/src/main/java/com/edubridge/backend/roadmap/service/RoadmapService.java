package com.edubridge.backend.roadmap.service;

import com.edubridge.backend.roadmap.entity.Roadmap;
import com.edubridge.backend.roadmap.repository.RoadmapRepository;
import com.edubridge.backend.roadmap.dto.RoadmapRequest;
import com.edubridge.backend.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.*;

@Service
public class RoadmapService {
    private final RoadmapRepository repo;
    private final UserRepository users;
    private final ObjectMapper mapper;

    public RoadmapService(RoadmapRepository r, UserRepository u, ObjectMapper m) {
        repo = r;
        users = u;
        mapper = m;
    }

    @Transactional
    public Roadmap create(String email, RoadmapRequest req) {
        var user = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Roadmap r = new Roadmap();
        r.setStudent(user);
        r.setCareerGoal(req.careerGoal());
        try {
            r.setRoadmapData(req.roadmapData() == null ? "{}" : mapper.writeValueAsString(req.roadmapData()));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid roadmap JSON");
        }
        r.setCreatedAt(Instant.now());
        r.setUpdatedAt(Instant.now());
        return repo.save(r);
    }

    @Transactional(readOnly = true)
    public List<Roadmap> mine(String email) {
        var u = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return repo.findAllByStudent_IdOrderByCreatedAtDesc(u.getId());
    }

    @Transactional
    public Roadmap update(UUID id, String email, RoadmapRequest req) {
        var u = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Roadmap r = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!r.getStudent().getId().equals(u.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        r.setCareerGoal(req.careerGoal());
        try {
            r.setRoadmapData(req.roadmapData() == null ? "{}" : mapper.writeValueAsString(req.roadmapData()));
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        r.setUpdatedAt(Instant.now());
        return repo.save(r);
    }
}
