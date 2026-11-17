package com.edubridge.backend.friend.controller;
import com.edubridge.backend.friend.dto.*;
import com.edubridge.backend.friend.service.FriendService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/friends")
public class FriendController {
 private final FriendService service; public FriendController(FriendService s){service=s;}
 @PostMapping("/request/{userId}") @ResponseStatus(HttpStatus.CREATED)
 public FriendRequestResponse send(@PathVariable UUID userId,Authentication a){return service.send(a.getName(),userId);}
 @GetMapping("/requests/incoming") public List<FriendRequestResponse> incoming(Authentication a){return service.incoming(a.getName());}
 @GetMapping("/requests/outgoing") public List<FriendRequestResponse> outgoing(Authentication a){return service.outgoing(a.getName());}
 @PostMapping("/{requestId}/accept") public FriendRequestResponse accept(@PathVariable UUID requestId,Authentication a){return service.accept(a.getName(),requestId);}
 @PostMapping("/{requestId}/reject") public FriendRequestResponse reject(@PathVariable UUID requestId,Authentication a){return service.reject(a.getName(),requestId);}
 @DeleteMapping("/requests/{requestId}") @ResponseStatus(HttpStatus.NO_CONTENT) public void cancel(@PathVariable UUID requestId,Authentication a){service.cancel(a.getName(),requestId);}
 @GetMapping public List<FriendUserResponse> friends(Authentication a){return service.friends(a.getName());}
 @DeleteMapping("/{userId}") @ResponseStatus(HttpStatus.NO_CONTENT) public void remove(@PathVariable UUID userId,Authentication a){service.remove(a.getName(),userId);}
}
