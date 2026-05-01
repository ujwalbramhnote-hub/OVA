package com.dto;

import jakarta.validation.constraints.*;
import com.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotNull
    @Min(18)
    private Integer age;

    @NotNull
    private Role role;

    private String party;
    private String description;
    private String manifesto;
    private String imageUrl;
}
