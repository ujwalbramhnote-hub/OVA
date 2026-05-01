package com.service;

import com.dto.UserDTO;
import com.entity.User;
import com.entity.Vote;
import com.entity.Candidate;
import com.repository.UserRepository;
import com.repository.VoteRepository;
import com.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    public UserDTO getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setRole(user.getRole());
        dto.setHasVoted(user.isHasVoted());
        return dto;
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        candidateRepository.findByUserId(id).ifPresent(candidate -> {
            List<Vote> candidateVotes = voteRepository.findAllByCandidateId(candidate.getId());
            for (Vote vote : candidateVotes) {
                User voter = vote.getUser();
                if (voter != null) {
                    voter.setHasVoted(false);
                    userRepository.save(voter);
                }
                voteRepository.delete(vote);
            }
            candidateRepository.delete(candidate);
        });

        voteRepository.findByUserId(id).ifPresent(vote -> {
            Candidate candidate = vote.getCandidate();
            if (candidate != null) {
                int currentVotes = candidate.getVoteCount() == null ? 0 : candidate.getVoteCount();
                candidate.setVoteCount(Math.max(currentVotes - 1, 0));
                candidateRepository.save(candidate);
            }
            voteRepository.delete(vote);
        });

        userRepository.delete(user);
    }
}
