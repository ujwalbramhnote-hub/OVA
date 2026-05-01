package com.controller;

import com.dto.CandidateDTO;
import com.dto.CandidateResultDto;
import com.dto.MessageResponse;
import com.dto.UserDTO;
import com.security.services.UserDetailsImpl;
import com.service.CandidateService;
import com.service.UserService;
import com.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private UserService userService;
    @Autowired
    private VoteService voteService;

    @GetMapping("/candidates")
    public ResponseEntity<List<CandidateDTO>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/results")
    public ResponseEntity<List<CandidateResultDto>> getResults() {
        return ResponseEntity.ok(candidateService.getResults());
    }

    @GetMapping("/user/profile")
    public ResponseEntity<UserDTO> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getId()));
    }

    @PostMapping("/user/vote")
    public ResponseEntity<?> castVote(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, Long> request) {
        try {
            Long candidateId = request.get("candidate_id");
            voteService.castVote(userDetails.getId(), candidateId);
            return ResponseEntity.ok(new MessageResponse("Vote cast successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
