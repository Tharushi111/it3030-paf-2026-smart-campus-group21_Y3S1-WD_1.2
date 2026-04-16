package com.campusnexus.backend.controller;

import com.campusnexus.backend.dto.UserResponse;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<UserResponse> createUser(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam Role role,
            @RequestParam Boolean active,
            @RequestParam(required = false) MultipartFile profileImage
    ) {
        UserResponse created = adminUserService.createUser(
                fullName,
                email,
                role,
                active,
                profileImage
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam Role role,
            @RequestParam Boolean active,
            @RequestParam(required = false) MultipartFile profileImage,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                adminUserService.updateUser(
                        id,
                        fullName,
                        email,
                        role,
                        active,
                        profileImage,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            Authentication authentication
    ) {
        adminUserService.deleteUser(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}