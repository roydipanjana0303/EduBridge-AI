package com.edubridge.backend.doubt.service;
import com.edubridge.backend.doubt.entity.Doubt; import com.edubridge.backend.doubt.repository.DoubtRepository; import com.edubridge.backend.doubt.dto.*;
import com.edubridge.backend.subject.repository.SubjectRepository; import com.edubridge.backend.user.repository.UserRepository; import com.edubridge.backend.user.entity.Role;
import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import org.springframework.web.server.ResponseStatusException; import java.time.Instant; import java.util.*;
@Service public class DoubtService {
 private final DoubtRepository doubts; private final UserRepository users; private final SubjectRepository subjects;
 public DoubtService(DoubtRepository d,UserRepository u,SubjectRepository s){doubts=d;users=u;subjects=s;}
 @Transactional public Doubt create(String email,CreateDoubtRequest req){
  var u=users.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED)); Doubt d=new Doubt();d.setStudent(u);d.setQuestion(req.question());d.setStatus("PENDING");d.setCreatedAt(Instant.now());
  if(req.subjectId()!=null)d.setSubject(subjects.findById(req.subjectId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Subject not found")));
  return doubts.save(d);
 }
 @Transactional(readOnly=true) public List<Doubt> mine(String email){var u=users.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));return doubts.findAllByStudent_IdOrderByCreatedAtDesc(u.getId());}
 @Transactional public Doubt answer(UUID id,String email,AnswerDoubtRequest req){
  var u=users.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  if(u.getRole()!=Role.TEACHER && u.getRole()!=Role.ADMIN)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Teacher or admin role required");
  Doubt d=doubts.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Doubt not found"));
  d.setAnswer(req.answer());d.setStatus("ANSWERED");d.setAnsweredAt(Instant.now());return doubts.save(d);
 }
}
