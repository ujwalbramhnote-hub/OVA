package com.config;

import com.entity.Role;
import com.entity.User;
import com.entity.Candidate;
import com.repository.CandidateRepository;
import com.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class DataInitializer {

    @Value("${app.seed.admin-password:admin123}")
    private String adminPassword;

    @Value("${app.seed.voter-password:user12345}")
    private String voterPassword;

    @Value("${app.seed.candidate-password:candidate123}")
    private String candidatePassword;

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               CandidateRepository candidateRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            seedUser(userRepository, passwordEncoder, "Admin User", "admin@demo.com", adminPassword, 30, Role.ADMIN);
            seedUser(userRepository, passwordEncoder, "Demo Voter", "user@demo.com", voterPassword, 24, Role.VOTER);
            User candidateUser = seedUser(userRepository, passwordEncoder, "Demo Candidate", "candidate@demo.com", candidatePassword, 32, Role.CANDIDATE);

            if (candidateUser != null) {
                seedCandidate(candidateRepository, candidateUser, "Demo Candidate", "Progress Party", "A candidate focused on transparency, services, and voter trust.", "A practical manifesto for public accountability and digital access.", null);
            }
            seedCandidate(candidateRepository, "John Smith", "Independent", "A balanced candidate focused on transparency and voting access.");
            seedCandidate(candidateRepository, "Jane Doe", "Progress Party", "A candidate focused on digital governance and civic participation.");
            seedCandidate(candidateRepository, "Alex Johnson", "Unity Alliance", "A candidate focused on infrastructure and public services.");
        };
    }

    private User seedUser(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          String name, String email, String rawPassword, Integer age, Role role) {
        if (userRepository.existsByEmail(email) || userRepository.existsByName(name)) {
            return userRepository.findByEmail(email).orElse(null);
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setAge(age);
        user.setRole(role);
        return userRepository.save(user);
    }

    private void seedCandidate(CandidateRepository candidateRepository, User user, String name, String party, String description, String manifesto, String imageUrl) {
        if (candidateRepository.findByUserId(user.getId()).isPresent() || candidateRepository.existsByName(name)) {
            return;
        }

        Candidate candidate = new Candidate();
        candidate.setName(name);
        candidate.setParty(party);
        candidate.setDescription(description);
        candidate.setManifesto(manifesto);
        candidate.setImageUrl(imageUrl);
        candidate.setVoteCount(0);
        candidate.setUser(user);
        candidateRepository.save(candidate);
    }

    private void seedCandidate(CandidateRepository candidateRepository, String name, String party, String description) {
        if (candidateRepository.existsByName(name)) {
            return;
        }

        Candidate candidate = new Candidate();
        candidate.setName(name);
        candidate.setParty(party);
        candidate.setDescription(description);
        candidate.setVoteCount(0);
        candidateRepository.save(candidate);
    }
}
