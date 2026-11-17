package com.edubridge.backend.doubt.repository;
import com.edubridge.backend.doubt.entity.Doubt; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface DoubtRepository extends JpaRepository<Doubt,UUID>{List<Doubt> findAllByStudent_IdOrderByCreatedAtDesc(UUID studentId);}
