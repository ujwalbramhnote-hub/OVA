package com.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VoteDTO {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private LocalDateTime timestamp;
}
