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
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    private Map<String, Object> createSuccessResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    public ResponseEntity<Object> createUser(User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Email already exists"));
            }
            userRepository.save(user);
            return ResponseEntity.ok().body(createSuccessResponse("User created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Error creating user: " + e.getMessage()));
        }
    }

    public UserDTO getUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            userDTO.setProfileImage(user.getProfileImage());
            userDTO.setMobileNumber(user.getMobileNumber());
            userDTO.setSource(user.getSource().toString());
            userDTO.setFollowedUsers(user.getFollowedUsers());
            userDTO.setFollowingUsers(user.getFollowingUsers());
            userDTO.setFollowersCount(user.getFollowersCount());
            userDTO.setFollowingCount(user.getFollowingCount());
            return userDTO;
        }
        return null;
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setId(user.getId());
                    userDTO.setName(user.getName());
                    userDTO.setEmail(user.getEmail());
                    userDTO.setProfileImage(user.getProfileImage());
                    userDTO.setMobileNumber(user.getMobileNumber());
                    userDTO.setSource(user.getSource().toString());
                    userDTO.setFollowedUsers(user.getFollowedUsers());
                    userDTO.setFollowingUsers(user.getFollowingUsers());
                    userDTO.setFollowersCount(user.getFollowersCount());
                    userDTO.setFollowingCount(user.getFollowingCount());
                    return userDTO;
                })
                .toList();
    }

    public ResponseEntity<Object> followUser(String userId, String followedUserId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            Optional<User> followedUserOptional = userRepository.findById(followedUserId);

            if (userOptional.isEmpty() || followedUserOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            User user = userOptional.get();
            User followedUser = followedUserOptional.get();

            if (user.getFollowingUsers() == null) {
                user.setFollowingUsers(new ArrayList<>());
            }

            if (user.getFollowingUsers().contains(followedUserId)) {
                user.getFollowingUsers().remove(followedUserId);
                userRepository.save(user);
                return ResponseEntity.ok().body(createSuccessResponse("User unfollowed successfully"));
            } else {
                user.getFollowingUsers().add(followedUserId);
                userRepository.save(user);
                return ResponseEntity.ok().body(createSuccessResponse("User followed successfully"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Error following user: " + e.getMessage()));
        }
    }

    public ResponseEntity<Object> loginUser(String email, String password) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid password"));
            }
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            userDTO.setProfileImage(user.getProfileImage());
            userDTO.setMobileNumber(user.getMobileNumber());
            userDTO.setSource(user.getSource().toString());
            userDTO.setFollowedUsers(user.getFollowedUsers());
            userDTO.setFollowingUsers(user.getFollowingUsers());
            userDTO.setFollowersCount(user.getFollowersCount());
            userDTO.setFollowingCount(user.getFollowingCount());
            return ResponseEntity.ok().body(createSuccessResponse(userDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Error logging in: " + e.getMessage()));
        }
    }

    public ResponseEntity<Object> uploadProfileImage(String userId, MultipartFile image) {
        try {
            System.out.println("Received image upload request for user: " + userId);
            System.out.println("Image details - Name: " + image.getOriginalFilename() + 
                             ", Size: " + image.getSize() + 
                             ", Content Type: " + image.getContentType());

            if (image == null || image.isEmpty()) {
                System.out.println("No image file provided");
                return ResponseEntity.badRequest().body(createErrorResponse("No image file provided"));
            }

            if (image.getSize() > 5 * 1024 * 1024) { // 5MB limit
                System.out.println("Image size exceeds limit: " + image.getSize());
                return ResponseEntity.badRequest().body(createErrorResponse("Image size exceeds 5MB limit"));
            }

            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                System.out.println("Invalid content type: " + contentType);
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid file type. Only images are allowed"));
            }

            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                System.out.println("User not found: " + userId);
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            User user = userOptional.get();
            System.out.println("Converting image to base64...");
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            System.out.println("Base64 conversion successful, length: " + base64Image.length());
            
            user.setProfileImage(base64Image);
            System.out.println("Saving user with new profile image...");
            userRepository.save(user);
            System.out.println("User saved successfully");

            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            userDTO.setProfileImage(user.getProfileImage());
            userDTO.setMobileNumber(user.getMobileNumber());
            userDTO.setSource(user.getSource().toString());
            userDTO.setFollowedUsers(user.getFollowedUsers());
            userDTO.setFollowingUsers(user.getFollowingUsers());
            userDTO.setFollowersCount(user.getFollowersCount());
            userDTO.setFollowingCount(user.getFollowingCount());

            System.out.println("Returning success response");
            return ResponseEntity.ok().body(createSuccessResponse(userDTO));
        } catch (IOException e) {
            System.out.println("Error during image upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse("Error uploading image: " + e.getMessage()));
        } catch (Exception e) {
            System.out.println("Unexpected error during image upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createErrorResponse("Unexpected error: " + e.getMessage()));
        }
    }
}
