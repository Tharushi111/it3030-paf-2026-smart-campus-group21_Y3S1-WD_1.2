package com.campusnexus.backend.security;

import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.AuthProvider;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OAuth2UserServiceImpl implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final AppUserRepository userRepository;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Value("${app.admin.emails:}")
    private String adminEmailsProperty;

    @Value("${app.staff.emails:}")
    private String staffEmailsProperty;

    public OAuth2UserServiceImpl(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("OAuth2UserServiceImpl.loadUser() called");

        OAuth2User oauth2User = delegate.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        System.out.println("Google email: " + email);
        System.out.println("Google name: " + name);

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Google account email is required");
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

        System.out.println("Admin emails: " + adminEmails);
        System.out.println("Staff emails: " + staffEmails);

        Role assignedRole;
        if (adminEmails.contains(email.toLowerCase())) {
            assignedRole = Role.ADMIN;
        } else if (staffEmails.contains(email.toLowerCase())) {
            assignedRole = Role.STAFF;
        } else {
            assignedRole = Role.USER;
        }

        System.out.println("Assigned role for " + email + " = " + assignedRole);

        AppUser user = userRepository.findByEmail(email)
                .map(existing -> {
                    System.out.println("Existing user found in DB with role: " + existing.getRole());
                    existing.setFullName(name != null ? name : existing.getFullName());
                    existing.setProfileImageUrl(picture);
                    existing.setRole(assignedRole);
                    existing.setProvider(AuthProvider.GOOGLE);
                    existing.setActive(true);
                    return existing;
                })
                .orElseGet(() -> {
                    System.out.println("Creating new user with role: " + assignedRole);
                    return AppUser.builder()
                            .fullName(name != null ? name : "Google User")
                            .email(email)
                            .profileImageUrl(picture)
                            .role(assignedRole)
                            .provider(AuthProvider.GOOGLE)
                            .active(true)
                            .build();
                });

        AppUser savedUser = userRepository.save(user);
        System.out.println("Saved user role in DB: " + savedUser.getRole());

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + assignedRole.name())
        );

        return new DefaultOAuth2User(authorities, oauth2User.getAttributes(), "email");
    }
}