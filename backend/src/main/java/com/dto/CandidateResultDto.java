package com.dto;

import lombok.Data;

@Data
public class CandidateResultDto {
    private Long candidateId;
    private String name;
    private String party;
    private Integer totalVotes;
}
