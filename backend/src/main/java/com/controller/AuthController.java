package com.controller;

import com.dto.JwtResponse;
import com.dto.LoginRequest;
import com.dto.MessageResponse;
import com.dto.RegisterRequest;
import com.dto.UserDTO;
import com.entity.Role;
import com.entity.User;
import com.repository.UserRepository;
import com.security.jwt.JwtUtils;
import com.security.services.UserDetailsImpl;
import com.service.CandidateService;
import com.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@Autowired
	UserService userService;

	@Autowired
	CandidateService candidateService;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getName(), 
												 userDetails.getEmail(), 
												 userDetails.getRole(),
												 roles));
	}

	@GetMapping("/me")
	public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
		return ResponseEntity.ok(userService.getUserProfile(userDetails.getId()));
	}

	@PostMapping("/register")
	@Transactional
	public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}

		if (signUpRequest.getRole() == null) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Role is required!"));
		}

		if (signUpRequest.getRole() == Role.ADMIN) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Public admin registration is not allowed!"));
		}

		if (signUpRequest.getRole() == Role.CANDIDATE) {
			if (signUpRequest.getParty() == null || signUpRequest.getParty().isBlank()) {
				return ResponseEntity.badRequest().body(new MessageResponse("Error: Party is required for candidate registration!"));
			}
		}

		User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setAge(signUpRequest.getAge());
        user.setRole(signUpRequest.getRole());
        user.setHasVoted(false);

		User savedUser = userRepository.save(user);

		if (savedUser.getRole() == Role.CANDIDATE) {
			candidateService.createCandidateProfile(savedUser, signUpRequest);
		}

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
}
