package com.dto;

import lombok.Data;

@Data
public class CandidateProfileDto {
    private Long candidateId;
    private String name;
    private String party;
    private String description;
    private String manifesto;
    private String imageUrl;
    private Integer totalVotes;
}
