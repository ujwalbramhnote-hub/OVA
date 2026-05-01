package com.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CandidateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String party;

    private String description;
    private String manifesto;
    private String imageUrl;
}
