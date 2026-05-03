package com.controller;

import com.dto.AuditEventDTO;
import com.security.services.UserDetailsImpl;
import com.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {
    @Autowired
    private AuditService auditService;

    @GetMapping("/events")
    public ResponseEntity<List<AuditEventDTO>> getEvents(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(auditService.getRecentEvents());
    }
}
