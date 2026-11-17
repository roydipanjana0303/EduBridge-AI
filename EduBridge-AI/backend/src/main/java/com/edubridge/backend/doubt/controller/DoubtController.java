package com.edubridge.backend.doubt.controller;
import com.edubridge.backend.doubt.dto.*; import com.edubridge.backend.doubt.entity.Doubt; import com.edubridge.backend.doubt.service.DoubtService;
import jakarta.validation.Valid; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/doubts") public class DoubtController {
 private final DoubtService service; public DoubtController(DoubtService s){service=s;}
 @PostMapping public Doubt create(@Valid @RequestBody CreateDoubtRequest req,Authentication a){return service.create(a.getName(),req);}
 @GetMapping("/my") public List<Doubt> mine(Authentication a){return service.mine(a.getName());}
 @PutMapping("/{id}/answer") public Doubt answer(@PathVariable UUID id,@Valid @RequestBody AnswerDoubtRequest req,Authentication a){return service.answer(id,a.getName(),req);}
}
