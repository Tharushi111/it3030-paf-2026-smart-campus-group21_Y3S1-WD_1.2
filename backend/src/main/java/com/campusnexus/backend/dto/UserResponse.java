package com.campusnexus.backend.dto;

import com.campusnexus.backend.model.AuthProvider;
import com.campusnexus.backend.model.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private Role role;
    private AuthProvider provider;
    private boolean active;
}