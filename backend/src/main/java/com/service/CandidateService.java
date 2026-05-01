package com.service;

import com.dto.CandidateDTO;
import com.dto.CandidateProfileDto;
import com.dto.CandidateRequest;
import com.dto.CandidateResultDto;
import com.dto.RegisterRequest;
import com.entity.Candidate;
import com.entity.User;
import com.entity.Vote;
import com.repository.CandidateRepository;
import com.repository.UserRepository;
import com.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private UserRepository userRepository;

    public List<CandidateDTO> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(this::convertToCandidateDTO)
                .collect(Collectors.toList());
    }

    public List<CandidateResultDto> getResults() {
        return candidateRepository.findAll().stream()
                .map(this::convertToResultDto)
                .collect(Collectors.toList());
    }

    public CandidateProfileDto getCandidateProfile(Long userId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        return convertToProfileDto(candidate);
    }

    public CandidateDTO createCandidateProfile(User user, RegisterRequest request) {
        if (candidateRepository.existsByName(user.getName())) {
            throw new RuntimeException("Candidate profile already exists");
        }

        Candidate candidate = new Candidate();
        candidate.setUser(user);
        candidate.setName(user.getName());
        candidate.setParty(request.getParty());
        candidate.setDescription(request.getDescription());
        candidate.setManifesto(request.getManifesto());
        candidate.setImageUrl(request.getImageUrl());
        candidate.setVoteCount(0);
        return convertToCandidateDTO(candidateRepository.save(candidate));
    }

    public CandidateDTO addCandidate(CandidateRequest candidateRequest) {
        Candidate candidate = new Candidate();
        candidate.setName(candidateRequest.getName());
        candidate.setParty(candidateRequest.getParty());
        candidate.setDescription(candidateRequest.getDescription());
        candidate.setManifesto(candidateRequest.getManifesto());
        candidate.setImageUrl(candidateRequest.getImageUrl());
        candidate.setVoteCount(0);
        return convertToCandidateDTO(candidateRepository.save(candidate));
    }

    public CandidateDTO updateCandidate(Long id, CandidateRequest candidateDetails) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setName(candidateDetails.getName());
        candidate.setParty(candidateDetails.getParty());
        candidate.setDescription(candidateDetails.getDescription());
        candidate.setManifesto(candidateDetails.getManifesto());
        candidate.setImageUrl(candidateDetails.getImageUrl());
        return convertToCandidateDTO(candidateRepository.save(candidate));
    }

    @Transactional
    public void deleteCandidate(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        User linkedUser = candidate.getUser();

        List<Vote> votes = voteRepository.findAllByCandidateId(id);
        for (Vote vote : votes) {
            User voter = vote.getUser();
            if (voter != null) {
                voter.setHasVoted(false);
                userRepository.save(voter);
            }
            voteRepository.delete(vote);
        }

        candidateRepository.delete(candidate);

        if (linkedUser != null) {
            userRepository.delete(linkedUser);
        }
    }

    private CandidateDTO convertToCandidateDTO(Candidate candidate) {
        CandidateDTO dto = new CandidateDTO();
        dto.setId(candidate.getId());
        dto.setName(candidate.getName());
        dto.setParty(candidate.getParty());
        dto.setDescription(candidate.getDescription());
        dto.setManifesto(candidate.getManifesto());
        dto.setImageUrl(candidate.getImageUrl());
        return dto;
    }

    private CandidateResultDto convertToResultDto(Candidate candidate) {
        CandidateResultDto dto = new CandidateResultDto();
        dto.setCandidateId(candidate.getId());
        dto.setName(candidate.getName());
        dto.setParty(candidate.getParty());
        dto.setTotalVotes(candidate.getVoteCount() == null ? 0 : candidate.getVoteCount());
        return dto;
    }

    private CandidateProfileDto convertToProfileDto(Candidate candidate) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setCandidateId(candidate.getId());
        dto.setName(candidate.getName());
        dto.setParty(candidate.getParty());
        dto.setDescription(candidate.getDescription());
        dto.setManifesto(candidate.getManifesto());
        dto.setImageUrl(candidate.getImageUrl());
        dto.setTotalVotes(candidate.getVoteCount() == null ? 0 : candidate.getVoteCount());
        return dto;
    }
}
