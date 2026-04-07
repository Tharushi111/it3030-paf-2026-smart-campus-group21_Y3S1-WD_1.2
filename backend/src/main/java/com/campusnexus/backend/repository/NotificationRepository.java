package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    void deleteByReferenceIdAndReferenceType(Long referenceId, String referenceType);

    void deleteByReferenceIdAndReferenceTypeAndUserEmail(Long referenceId, String referenceType, String userEmail);
}