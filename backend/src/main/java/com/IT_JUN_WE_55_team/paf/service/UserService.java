package com.IT_JUN_WE_55_team.paf.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.IT_JUN_WE_55_team.paf.DTO.UserDTO;
import com.IT_JUN_WE_55_team.paf.model.User;
import com.IT_JUN_WE_55_team.paf.repository.UserRepository;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<Object> createUser(User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            userRepository.save(user);
            return ResponseEntity.ok().body("User created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    public UserDTO getUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getProfileImage());
        }
        return null;
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getProfileImage()))
                .toList();
    }

    public ResponseEntity<Object> followUser(String userId, String followedUserId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            Optional<User> followedUserOptional = userRepository.findById(followedUserId);

            if (userOptional.isEmpty() || followedUserOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOptional.get();
            User followedUser = followedUserOptional.get();

            if (user.getFollowingUsers() == null) {
                user.setFollowingUsers(new ArrayList<>());
            }

            if (user.getFollowingUsers().contains(followedUserId)) {
                user.getFollowingUsers().remove(followedUserId);
                userRepository.save(user);
                return ResponseEntity.ok().body("User unfollowed successfully");
            } else {
                user.getFollowingUsers().add(followedUserId);
                userRepository.save(user);
                return ResponseEntity.ok().body("User followed successfully");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error following user: " + e.getMessage());
        }
    }

    public ResponseEntity<Object> loginUser(String email, String password) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.badRequest().body("Invalid password");
            }
            return ResponseEntity.ok().body(new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getProfileImage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error logging in: " + e.getMessage());
        }
    }

    public ResponseEntity<Object> uploadProfileImage(String userId, MultipartFile image) {
        try {
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body("No image file provided");
            }

            if (image.getSize() > 5 * 1024 * 1024) { // 5MB limit
                return ResponseEntity.badRequest().body("Image size exceeds 5MB limit");
            }

            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Invalid file type. Only images are allowed");
            }

            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOptional.get();
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            user.setProfileImage(base64Image);
            userRepository.save(user);

            return ResponseEntity.ok().body("Profile image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error uploading image: " + e.getMessage());
        }
    }
}
