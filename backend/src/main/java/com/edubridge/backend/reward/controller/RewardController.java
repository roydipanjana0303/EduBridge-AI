package com.edubridge.backend.reward.controller;
import com.edubridge.backend.reward.entity.Reward; import com.edubridge.backend.reward.service.RewardService; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/rewards") public class RewardController {
 private final RewardService service; public RewardController(RewardService s){service=s;}
 @GetMapping("/my") public List<Reward> mine(Authentication a){return service.mine(a.getName());}
 @GetMapping("/my/total") public Integer total(Authentication a){return service.total(a.getName());}
}
