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
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Google account email is required");
        }

        String normalizedEmail = email.trim().toLowerCase();

        Set<String> adminEmails = parseEmails(adminEmailsProperty);
        Set<String> staffEmails = parseEmails(staffEmailsProperty);

        AppUser savedUser = userRepository.findByEmail(normalizedEmail)
                .map(existing -> {
                    existing.setFullName(name != null && !name.isBlank() ? name : existing.getFullName());
                    existing.setProfileImageUrl(picture);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    Role assignedRole;
                    if (adminEmails.contains(normalizedEmail)) {
                        assignedRole = Role.ADMIN;
                    } else if (staffEmails.contains(normalizedEmail)) {
                        assignedRole = Role.STAFF;
                    } else {
                        assignedRole = Role.USER;
                    }

                    AppUser user = AppUser.builder()
                            .fullName(name != null && !name.isBlank() ? name : "Google User")
                            .email(normalizedEmail)
                            .profileImageUrl(picture)
                            .role(assignedRole)
                            .provider(AuthProvider.GOOGLE)
                            .active(true)
                            .build();

                    return userRepository.save(user);
                });

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name())
        );

        Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());
        attributes.put("appUserId", savedUser.getId());
        attributes.put("role", savedUser.getRole().name());
        attributes.put("email", savedUser.getEmail());
        attributes.put("fullName", savedUser.getFullName());
        attributes.put("profileImageUrl", savedUser.getProfileImageUrl());
        attributes.put("active", savedUser.isActive());

        return new DefaultOAuth2User(authorities, attributes, "email");
    }

    private Set<String> parseEmails(String emailsProperty) {
        if (emailsProperty == null || emailsProperty.isBlank()) {
            return Collections.emptySet();
        }

        return Arrays.stream(emailsProperty.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}