package com.edubridge.backend.friend.repository;
import com.edubridge.backend.friend.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
import java.util.UUID;
public interface FriendshipRepository extends JpaRepository<Friendship,UUID> {
 Optional<Friendship> findByIdAndReceiver_Email(UUID id,String email);
 Optional<Friendship> findByIdAndSender_Email(UUID id,String email);
 @Query("select f from Friendship f where ((f.sender.id=:a and f.receiver.id=:b) or (f.sender.id=:b and f.receiver.id=:a)) and f.status in :statuses")
 Optional<Friendship> findBetween(@Param("a") UUID a,@Param("b") UUID b,@Param("statuses") Collection<FriendshipStatus> statuses);
 @Query("select f from Friendship f where f.receiver.id=:id and f.status=:s order by f.createdAt desc")
 List<Friendship> incoming(@Param("id") UUID id,@Param("s") FriendshipStatus s);
 @Query("select f from Friendship f where f.sender.id=:id and f.status=:s order by f.createdAt desc")
 List<Friendship> outgoing(@Param("id") UUID id,@Param("s") FriendshipStatus s);
 @Query("select f from Friendship f where (f.sender.id=:id or f.receiver.id=:id) and f.status=:s")
 List<Friendship> relationships(@Param("id") UUID id,@Param("s") FriendshipStatus s);
}
