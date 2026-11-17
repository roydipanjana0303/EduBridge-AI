package com.edubridge.backend.result.repository;

import com.edubridge.backend.result.entity.ResultAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ResultAnswerRepository extends JpaRepository<ResultAnswer, UUID> {
    List<ResultAnswer> findAllByResult_Id(UUID resultId);
}
