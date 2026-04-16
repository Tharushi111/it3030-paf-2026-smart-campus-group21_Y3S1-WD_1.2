package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Notification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    @Transactional
    void deleteByReferenceIdAndReferenceType(Long referenceId, String referenceType);

    @Transactional
    void deleteByReferenceIdAndReferenceTypeAndUserEmail(Long referenceId, String referenceType, String userEmail);

    @Transactional
    void deleteByIdAndUserEmail(Long id, String userEmail);
}