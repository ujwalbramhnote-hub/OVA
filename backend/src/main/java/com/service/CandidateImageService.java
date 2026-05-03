package com.service;

import com.dto.ImageUploadResponse;
import com.entity.Candidate;
import com.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

@Service
public class CandidateImageService {
    private static final long MAX_FILE_SIZE = 2L * 1024L * 1024L;

    private final CandidateRepository candidateRepository;
    private final Path uploadRoot;

    public CandidateImageService(CandidateRepository candidateRepository,
                                 @Value("${file.upload-dir:uploads/}") String uploadDir) {
        this.candidateRepository = candidateRepository;
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(uploadRoot);
    }

    @Transactional
    public ImageUploadResponse uploadCandidateImage(Long candidateId, Long userId, MultipartFile file) {
        validateFile(file);

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        Candidate ownCandidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new AccessDeniedException("Candidate profile not found for current user"));

        if (!Objects.equals(candidate.getId(), ownCandidate.getId())) {
            throw new AccessDeniedException("You can only upload your own profile image");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getAllowedExtension(originalFilename);
        String fileName = UUID.randomUUID() + extension;
        Path targetPath = uploadRoot.resolve(fileName).normalize();

        if (!targetPath.startsWith(uploadRoot)) {
            throw new IllegalArgumentException("Invalid upload path");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store uploaded file", ex);
        }

        String imageUrl = "/uploads/" + fileName;
        candidate.setProfileImageUrl(imageUrl);
        candidate.setImageUrl(imageUrl);
        candidateRepository.save(candidate);

        return new ImageUploadResponse("Image uploaded", imageUrl);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size must be 2MB or less");
        }

        String contentType = file.getContentType();
        if (!"image/jpeg".equalsIgnoreCase(contentType) && !"image/png".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException("Only JPG and PNG images are allowed");
        }

        getAllowedExtension(file.getOriginalFilename());
    }

    private String getAllowedExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String lowerName = originalFilename.toLowerCase(Locale.ROOT);
        if (lowerName.endsWith(".jpg")) {
            return ".jpg";
        }
        if (lowerName.endsWith(".png")) {
            return ".png";
        }

        throw new IllegalArgumentException("Only JPG and PNG images are allowed");
    }
}
