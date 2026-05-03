package com.controller;

import com.dto.ImageUploadResponse;
import com.dto.CandidateProfileDto;
import com.security.services.UserDetailsImpl;
import com.service.CandidateImageService;
import com.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    @Autowired
    private CandidateService candidateService;

    @Autowired
    private CandidateImageService candidateImageService;

    @GetMapping({"/profile", "/me"})
    public ResponseEntity<CandidateProfileDto> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(candidateService.getCandidateProfile(userDetails.getId()));
    }

    @PostMapping(value = "/upload-image/{candidateId}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long candidateId,
                                                @AuthenticationPrincipal UserDetailsImpl userDetails,
                                                @RequestParam("file") MultipartFile file) {
        try {
            ImageUploadResponse response = candidateImageService.uploadCandidateImage(candidateId, userDetails.getId(), file);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
