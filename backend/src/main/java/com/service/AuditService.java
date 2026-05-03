package com.service;

import com.dto.AuditEventDTO;
import com.entity.AuditEvent;
import com.repository.AuditEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {
    @Autowired
    private AuditEventRepository auditEventRepository;

    public AuditEvent recordEvent(String action, String subject, String detail, String level, String actor, String actorRole) {
        AuditEvent event = new AuditEvent();
        event.setAction(action);
        event.setSubject(subject);
        event.setDetail(detail);
        event.setLevel(level == null ? "info" : level);
        event.setActor(actor == null ? "system" : actor);
        event.setActorRole(actorRole == null ? "SYSTEM" : actorRole);
        return auditEventRepository.save(event);
    }

    public void recordEventSafely(String action, String subject, String detail, String level, String actor, String actorRole) {
        try {
            recordEvent(action, subject, detail, level, actor, actorRole);
        } catch (Exception ignored) {
            // Audit history must never block the primary request flow.
        }
    }

    public List<AuditEventDTO> getRecentEvents() {
        return auditEventRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::toDto)
                .toList();
    }

    private AuditEventDTO toDto(AuditEvent event) {
        return new AuditEventDTO(
                event.getId(),
                event.getAction(),
                event.getSubject(),
                event.getDetail(),
                event.getLevel(),
                event.getActor(),
                event.getActorRole(),
                event.getTimestamp()
        );
    }
}
