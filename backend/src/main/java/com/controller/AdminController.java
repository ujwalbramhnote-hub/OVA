package com.controller;

import com.dto.CandidateDTO;
import com.dto.CandidateRequest;
import com.dto.CandidateResultDto;
import com.dto.UserDTO;
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

    @PostMapping({"/candidate", "/candidates"})
    public ResponseEntity<CandidateDTO> addCandidate(@RequestBody CandidateRequest candidate) {
        return ResponseEntity.ok(candidateService.addCandidate(candidate));
    }

    @PutMapping({"/candidate/{id}", "/candidates/{id}"})
    public ResponseEntity<CandidateDTO> updateCandidate(@PathVariable Long id, @RequestBody CandidateRequest candidate) {
        return ResponseEntity.ok(candidateService.updateCandidate(id, candidate));
    }

    @DeleteMapping({"/candidate/{id}", "/candidates/{id}"})
    public ResponseEntity<?> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
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
