package com.dto;

import com.entity.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    private Role role;
    private boolean hasVoted;
}
