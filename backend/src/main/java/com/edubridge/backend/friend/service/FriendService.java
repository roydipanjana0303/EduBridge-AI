package com.edubridge.backend.friend.service;
import com.edubridge.backend.friend.dto.*;
import com.edubridge.backend.friend.entity.*;
import com.edubridge.backend.friend.repository.FriendshipRepository;
import com.edubridge.backend.user.entity.User;
import com.edubridge.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
@Service @Transactional
public class FriendService {
 private final FriendshipRepository repo; private final UserRepository users;
 public FriendService(FriendshipRepository r,UserRepository u){repo=r;users=u;}
 private User me(String email){return users.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));}
 public FriendRequestResponse send(String email,UUID receiverId){
  User sender=me(email); User receiver=users.findById(receiverId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
  if(sender.getId().equals(receiverId))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cannot friend yourself");
  var old=repo.findBetween(sender.getId(),receiverId,List.of(FriendshipStatus.PENDING,FriendshipStatus.ACCEPTED,FriendshipStatus.BLOCKED));
  if(old.isPresent()){var f=old.get();if(f.getStatus()==FriendshipStatus.ACCEPTED)throw new ResponseStatusException(HttpStatus.CONFLICT,"Already friends");
   if(f.getStatus()==FriendshipStatus.BLOCKED)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Relationship blocked");
   throw new ResponseStatusException(HttpStatus.CONFLICT,"A pending request already exists");}
  Friendship f=new Friendship();f.setSender(sender);f.setReceiver(receiver);return FriendRequestResponse.from(repo.save(f));
 }
 public FriendRequestResponse accept(String email,UUID id){var f=repo.findByIdAndReceiver_Email(id,email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(f.getStatus()!=FriendshipStatus.PENDING)throw new ResponseStatusException(HttpStatus.CONFLICT,"Request is not pending");f.setStatus(FriendshipStatus.ACCEPTED);return FriendRequestResponse.from(f);}
 public FriendRequestResponse reject(String email,UUID id){var f=repo.findByIdAndReceiver_Email(id,email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(f.getStatus()!=FriendshipStatus.PENDING)throw new ResponseStatusException(HttpStatus.CONFLICT,"Request is not pending");f.setStatus(FriendshipStatus.REJECTED);return FriendRequestResponse.from(f);}
 public void cancel(String email,UUID id){var f=repo.findByIdAndSender_Email(id,email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  if(f.getStatus()!=FriendshipStatus.PENDING)throw new ResponseStatusException(HttpStatus.CONFLICT,"Request is not pending");repo.delete(f);}
 public List<FriendRequestResponse> incoming(String email){return repo.incoming(me(email).getId(),FriendshipStatus.PENDING).stream().map(FriendRequestResponse::from).toList();}
 public List<FriendRequestResponse> outgoing(String email){return repo.outgoing(me(email).getId(),FriendshipStatus.PENDING).stream().map(FriendRequestResponse::from).toList();}
 public List<FriendUserResponse> friends(String email){UUID id=me(email).getId();return repo.relationships(id,FriendshipStatus.ACCEPTED).stream()
  .map(f->f.getSender().getId().equals(id)?f.getReceiver():f.getSender()).map(u->new FriendUserResponse(u.getId(),u.getName(),u.getEmail(),u.getRole().name())).toList();}
 public void remove(String email,UUID friendId){UUID id=me(email).getId();var f=repo.findBetween(id,friendId,List.of(FriendshipStatus.ACCEPTED)).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  repo.delete(f);}
}
