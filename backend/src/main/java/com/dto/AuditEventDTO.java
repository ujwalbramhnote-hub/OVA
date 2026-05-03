package com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditEventDTO {
    private Long id;
    private String action;
    private String subject;
    private String detail;
    private String level;
    private String actor;
    private String actorRole;
    private LocalDateTime timestamp;
}
