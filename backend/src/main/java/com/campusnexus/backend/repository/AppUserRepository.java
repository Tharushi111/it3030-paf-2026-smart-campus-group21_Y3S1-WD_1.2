package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    List<AppUser> findByRole(Role role);
    List<AppUser> findAllByOrderByIdDesc();
}