package com.repository;

import com.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserId(Long userId);
    List<Vote> findAllByCandidateId(Long candidateId);
}
