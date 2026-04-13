package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.UserResponse;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.AuthProvider;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AppUserRepository appUserRepository;

    @Value("${app.user.upload.dir:uploads/users}")
    private String userUploadDir;

    public List<UserResponse> getAllUsers() {
        return appUserRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse createUser(String fullName,
                                   String email,
                                   Role role,
                                   Boolean active,
                                   MultipartFile profileImage) {

        validateUserFields(fullName, email, role, active);

        String normalizedEmail = email.trim().toLowerCase();

        if (appUserRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        String imagePath = saveProfileImage(profileImage);

        AppUser user = AppUser.builder()
                .fullName(fullName.trim())
                .email(normalizedEmail)
                .profileImageUrl(imagePath)
                .role(role)
                .provider(AuthProvider.MANUAL)
                .active(Boolean.TRUE.equals(active))
                .build();

        return toResponse(appUserRepository.save(user));
    }

    public UserResponse updateUser(Long id,
                                   String fullName,
                                   String email,
                                   Role role,
                                   Boolean active,
                                   MultipartFile profileImage,
                                   String currentAdminEmail) {

        validateUserFields(fullName, email, role, active);

        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String normalizedEmail = email.trim().toLowerCase();

        appUserRepository.findByEmail(normalizedEmail).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("Another user already uses this email");
            }
        });

        boolean editingSelf = user.getEmail().equalsIgnoreCase(currentAdminEmail);

        if (editingSelf && role != Role.ADMIN) {
            throw new IllegalArgumentException("You cannot change your own role from ADMIN");
        }

        if (editingSelf && !Boolean.TRUE.equals(active)) {
            throw new IllegalArgumentException("You cannot deactivate your own account");
        }

        user.setFullName(fullName.trim());
        user.setEmail(normalizedEmail);
        user.setRole(role);
        user.setActive(Boolean.TRUE.equals(active));

        if (profileImage != null && !profileImage.isEmpty()) {
            user.setProfileImageUrl(saveProfileImage(profileImage));
        }

        return toResponse(appUserRepository.save(user));
    }

    public void deleteUser(Long id, String currentAdminEmail) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("You cannot delete your own account");
        }

        appUserRepository.delete(user);
    }

    private void validateUserFields(String fullName,
                                    String email,
                                    Role role,
                                    Boolean active) {

        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        if (fullName.trim().length() < 3 || fullName.trim().length() > 100) {
            throw new IllegalArgumentException("Full name must be between 3 and 100 characters");
        }

        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        if (role == null) {
            throw new IllegalArgumentException("Role is required");
        }

        if (active == null) {
            throw new IllegalArgumentException("Active status is required");
        }
    }

    private String saveProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Profile image must be 5MB or less");
        }

        try {
            File dir = new File(userUploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
            String extension = "";

            int dotIndex = originalName.lastIndexOf(".");
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }

            String fileName = UUID.randomUUID() + extension;
            File destination = new File(dir, fileName);
            file.transferTo(destination);

            return "/uploads/users/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile image");
        }
    }

    private UserResponse toResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .provider(user.getProvider())
                .active(user.isActive())
                .build();
    }
}