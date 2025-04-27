package com.IT_JUN_WE_55_team.paf.service;

import com.IT_JUN_WE_55_team.paf.model.ProfileImage;
import com.IT_JUN_WE_55_team.paf.repository.ProfileImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ProfileImageService {

    @Autowired
    private ProfileImageRepository profileImageRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.allowed.file.types}")
    private String allowedFileTypes;

    public ResponseEntity<Object> uploadProfileImage(String userId, MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                return createErrorResponse("No file was uploaded", HttpStatus.BAD_REQUEST);
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !isAllowedFileType(contentType)) {
                return createErrorResponse("Only JPG, JPEG, and PNG files are allowed", HttpStatus.BAD_REQUEST);
            }

            // Create uploads directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (!created) {
                    return createErrorResponse("Failed to create upload directory", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = Paths.get(uploadDir + newFilename);
            Files.copy(file.getInputStream(), filePath);

            // Save metadata to database
            ProfileImage profileImage = new ProfileImage(
                userId,
                newFilename,
                contentType,
                "/api/images/" + newFilename,
                file.getSize()
            );
            profileImageRepository.save(profileImage);

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile image uploaded successfully");
            response.put("data", profileImage);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return createErrorResponse("Error uploading file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private boolean isAllowedFileType(String contentType) {
        String[] allowedTypes = allowedFileTypes.split(",");
        for (String type : allowedTypes) {
            if (type.equals(contentType)) {
                return true;
            }
        }
        return false;
    }

    private ResponseEntity<Object> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
} 