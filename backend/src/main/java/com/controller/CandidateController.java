package com.controller;

import com.dto.CandidateProfileDto;
import com.security.services.UserDetailsImpl;
import com.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    @Autowired
    private CandidateService candidateService;

    @GetMapping({"/profile", "/me"})
    public ResponseEntity<CandidateProfileDto> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(candidateService.getCandidateProfile(userDetails.getId()));
    }
}
