package com.campusnexus.backend.controller;

import com.campusnexus.backend.dto.UserResponse;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.AuthProvider;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AppUserRepository userRepository;

    @Value("${app.admin.emails:}")
    private String adminEmailsProperty;

    @Value("${app.staff.emails:}")
    private String staffEmailsProperty;

    public AuthController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller working");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User oauth2User)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid authenticated user"));
        }

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("message", "Email not found"));
        }

        Set<String> adminEmails = Arrays.stream(adminEmailsProperty.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        Set<String> staffEmails = Arrays.stream(staffEmailsProperty.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        Role assignedRole;
        if (adminEmails.contains(email.toLowerCase())) {
            assignedRole = Role.ADMIN;
        } else if (staffEmails.contains(email.toLowerCase())) {
            assignedRole = Role.STAFF;
        } else {
            assignedRole = Role.USER;
        }

        AppUser user = userRepository.findByEmail(email)
                .map(existing -> {
                    existing.setFullName(name != null ? name : existing.getFullName());
                    existing.setProfileImageUrl(picture);
                    existing.setRole(assignedRole);
                    existing.setProvider(AuthProvider.GOOGLE);
                    existing.setActive(true);
                    return existing;
                })
                .orElseGet(() -> AppUser.builder()
                        .fullName(name != null ? name : "Google User")
                        .email(email)
                        .profileImageUrl(picture)
                        .role(assignedRole)
                        .provider(AuthProvider.GOOGLE)
                        .active(true)
                        .build());

        AppUser savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                UserResponse.builder()
                        .id(savedUser.getId())
                        .fullName(savedUser.getFullName())
                        .email(savedUser.getEmail())
                        .profileImageUrl(savedUser.getProfileImageUrl())
                        .role(savedUser.getRole())
                        .build()
        );
    }

    @GetMapping("/debug-role")
    public ResponseEntity<?> debugRole(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "No authentication"));
        }

        return ResponseEntity.ok(Map.of(
                "name", authentication.getName(),
                "authorities", authentication.getAuthorities().toString()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}