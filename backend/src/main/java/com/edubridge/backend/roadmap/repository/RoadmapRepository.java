package com.edubridge.backend.roadmap.repository;
import com.edubridge.backend.roadmap.entity.Roadmap; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface RoadmapRepository extends JpaRepository<Roadmap,UUID>{List<Roadmap> findAllByStudent_IdOrderByCreatedAtDesc(UUID studentId);}
