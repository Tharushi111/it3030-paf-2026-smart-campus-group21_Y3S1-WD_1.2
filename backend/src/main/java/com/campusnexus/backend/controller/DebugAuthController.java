package com.campusnexus.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class DebugAuthController {

    @GetMapping("/api/debug/auth")
    public ResponseEntity<?> debugAuth(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", false
            ));
        }

        return ResponseEntity.ok(Map.of(
                "authenticated", authentication.isAuthenticated(),
                "name", authentication.getName(),
                "authorities", authentication.getAuthorities()
                        .stream()
                        .map(a -> a.getAuthority())
                        .collect(Collectors.toList()),
                "principalClass", authentication.getPrincipal().getClass().getName()
        ));
    }
}