package com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String name;
	private String email;
	private String role;
	private List<String> roles;

	public JwtResponse(String accessToken, Long id, String name, String email, String role, List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.name = name;
		this.email = email;
		this.role = role;
		this.roles = roles;
	}
}
