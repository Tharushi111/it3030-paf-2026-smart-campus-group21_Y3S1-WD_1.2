package com.campusnexus.backend.security;

import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.AuthProvider;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final AppUserRepository userRepository;

    @Value("${app.admin.emails:}")
    private String adminEmailsProperty;

    @Value("${app.staff.emails:}")
    private String staffEmailsProperty;

    public CustomOidcUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String picture = oidcUser.getPicture();

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

        Set<GrantedAuthority> mappedAuthorities = new HashSet<>(oidcUser.getAuthorities());
        mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()));

        return new DefaultOidcUser(
                mappedAuthorities,
                oidcUser.getIdToken(),
                oidcUser.getUserInfo(),
                "email"
        );
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