package com.repository;

import com.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByName(String name);
    Optional<Candidate> findByUserId(Long userId);
    Boolean existsByName(String name);
}
