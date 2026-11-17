package com.edubridge.backend.roadmap.controller;
import com.edubridge.backend.roadmap.dto.RoadmapRequest; import com.edubridge.backend.roadmap.entity.Roadmap; import com.edubridge.backend.roadmap.service.RoadmapService;
import jakarta.validation.Valid; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/roadmaps") public class RoadmapController {
 private final RoadmapService service; public RoadmapController(RoadmapService s){service=s;}
 @PostMapping public Roadmap create(@Valid @RequestBody RoadmapRequest req,Authentication a){return service.create(a.getName(),req);}
 @GetMapping("/my") public List<Roadmap> mine(Authentication a){return service.mine(a.getName());}
 @PutMapping("/{id}") public Roadmap update(@PathVariable UUID id,@Valid @RequestBody RoadmapRequest req,Authentication a){return service.update(id,a.getName(),req);}
}
