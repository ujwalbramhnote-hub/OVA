package com.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String action;

    @Column(nullable = false, length = 128)
    private String subject;

    @Column(length = 500)
    private String detail;

    @Column(nullable = false, length = 16)
    private String level;

    @Column(nullable = false, length = 128)
    private String actor;

    @Column(nullable = false, length = 32)
    private String actorRole;

    @Column(name = "event_timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (level == null || level.isBlank()) {
            level = "info";
        }
    }
}
