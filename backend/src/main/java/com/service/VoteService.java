package com.service;

import com.entity.Candidate;
import com.entity.Role;
import com.entity.User;
import com.entity.Vote;
import com.repository.CandidateRepository;
import com.repository.UserRepository;
import com.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class VoteService {
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    @Transactional
    public void castVote(Long userId, Long candidateId) {
        if (candidateId == null) {
            throw new RuntimeException("Candidate not found");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.VOTER) {
            throw new RuntimeException("Only voters can cast votes");
        }

        if (user.isHasVoted()) {
            throw new RuntimeException("User has already voted");
        }

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Vote vote = new Vote();
        vote.setUser(user);
        vote.setCandidate(candidate);
        vote.setTimestamp(LocalDateTime.now());
        voteRepository.save(vote);

        user.setHasVoted(true);
        userRepository.save(user);

        int currentVotes = candidate.getVoteCount() == null ? 0 : candidate.getVoteCount();
        candidate.setVoteCount(currentVotes + 1);
        candidateRepository.save(candidate);
    }
}
