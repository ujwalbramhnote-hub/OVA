package com.controller;

import com.dto.CandidateDTO;
import com.dto.CandidateRequest;
import com.dto.CandidateResultDto;
import com.dto.UserDTO;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.security.services.UserDetailsImpl;
import com.service.AuditService;
import com.service.CandidateService;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private UserService userService;
    @Autowired
    private AuditService auditService;

    @PostMapping({"/candidate", "/candidates"})
    public ResponseEntity<CandidateDTO> addCandidate(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody CandidateRequest candidate) {
        CandidateDTO created = candidateService.addCandidate(candidate);
        auditService.recordEventSafely(
                "candidate_added",
                created.getName(),
                "Candidate added from admin console",
                "success",
                userDetails.getEmail(),
                userDetails.getRole()
        );
        return ResponseEntity.ok(created);
    }

    @PutMapping({"/candidate/{id}", "/candidates/{id}"})
    public ResponseEntity<CandidateDTO> updateCandidate(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id, @RequestBody CandidateRequest candidate) {
        CandidateDTO updated = candidateService.updateCandidate(id, candidate);
        auditService.recordEventSafely(
                "candidate_updated",
                updated.getName(),
                "Candidate updated from admin console",
                "success",
                userDetails.getEmail(),
                userDetails.getRole()
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping({"/candidate/{id}", "/candidates/{id}"})
    public ResponseEntity<?> deleteCandidate(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        String candidateName = candidateService.getResults().stream()
                .filter(candidate -> candidate.getCandidateId().equals(id))
                .map(CandidateResultDto::getName)
                .findFirst()
                .orElse("candidate_id=" + id);
        candidateService.deleteCandidate(id);
        auditService.recordEventSafely(
                "candidate_deleted",
                candidateName,
                "Candidate deleted from admin console",
                "warning",
                userDetails.getEmail(),
                userDetails.getRole()
        );
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        String userName = userService.getAllUsers().stream()
                .filter(user -> user.getId().equals(id))
                .map(UserDTO::getEmail)
                .findFirst()
                .orElse("user_id=" + id);
        userService.deleteUser(id);
        auditService.recordEventSafely(
                "user_deleted",
                userName,
                "User deleted from admin console",
                "warning",
                userDetails.getEmail(),
                userDetails.getRole()
        );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/results")
    public ResponseEntity<List<CandidateResultDto>> getResults() {
        return ResponseEntity.ok(candidateService.getResults());
    }
}
