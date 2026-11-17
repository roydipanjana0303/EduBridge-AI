package com.edubridge.backend.reward.service;

import com.edubridge.backend.reward.entity.Reward;
import com.edubridge.backend.reward.repository.RewardRepository;
import com.edubridge.backend.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service
public class RewardService {
    private final RewardRepository rewards;
    private final UserRepository users;

    public RewardService(RewardRepository r, UserRepository u) {
        rewards = r;
        users = u;
    }

    @Transactional(readOnly = true)
    public List<Reward> mine(String email) {
        var u = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return rewards.findAllByStudent_IdOrderByCreatedAtDesc(u.getId());
    }

    @Transactional(readOnly = true)
    public Integer total(String email) {
        return mine(email).stream().mapToInt(r -> Optional.ofNullable(r.getPoints()).orElse(0)).sum();
    }
    // Awarding points is intentionally restricted to trusted backend
    // workflows/admin functionality.
}
