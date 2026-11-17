package com.edubridge.backend.reward.repository;
import com.edubridge.backend.reward.entity.Reward; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface RewardRepository extends JpaRepository<Reward,UUID>{List<Reward> findAllByStudent_IdOrderByCreatedAtDesc(UUID studentId);}
