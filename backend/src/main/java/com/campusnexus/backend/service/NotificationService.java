package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Notification;
import com.campusnexus.backend.model.NotificationPreference;
import com.campusnexus.backend.model.NotificationType;
import com.campusnexus.backend.repository.NotificationPreferenceRepository;
import com.campusnexus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String email,
                                 String message,
                                 NotificationType type,
                                 Long refId,
                                 String refType) {

        if (email == null || email.isBlank()) {
            return;
        }

        NotificationPreference pref = preferenceRepository
                .findByUserEmail(email)
                .orElse(null);

        if (pref != null) {
            if (type.name().contains("BOOKING") && !Boolean.TRUE.equals(pref.getBookingNotifications())) {
                return;
            }

            if (type.name().contains("TICKET") && !Boolean.TRUE.equals(pref.getTicketNotifications())) {
                return;
            }

            if (type == NotificationType.SYSTEM && !Boolean.TRUE.equals(pref.getSystemNotifications())) {
                return;
            }
        }

        Notification notification = new Notification();
        notification.setUserEmail(email);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(refId);
        notification.setReferenceType(refType);
        notification.setIsRead(false);

        Notification saved = notificationRepository.save(notification);

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + email,
                saved
        );
    }

    public List<Notification> getUserNotifications(String email) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public void deleteByReference(Long referenceId, String referenceType) {
        notificationRepository.deleteByReferenceIdAndReferenceType(referenceId, referenceType);
    }

    public void deleteByReferenceAndUser(Long referenceId, String referenceType, String email) {
        notificationRepository.deleteByReferenceIdAndReferenceTypeAndUserEmail(referenceId, referenceType, email);
    }
}