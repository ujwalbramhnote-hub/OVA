package com.dto;

import lombok.Data;

@Data
public class CandidateDTO {
    private Long id;
    private String name;
    private String party;
    private String description;
    private String manifesto;
    private String imageUrl;
    private String profileImageUrl;
}
