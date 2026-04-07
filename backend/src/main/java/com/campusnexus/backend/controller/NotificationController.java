package com.campusnexus.backend.controller;

import com.campusnexus.backend.model.Notification;
import com.campusnexus.backend.model.NotificationPreference;
import com.campusnexus.backend.service.NotificationPreferenceService;
import com.campusnexus.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationPreferenceService notificationPreferenceService;

    @GetMapping
    public List<Notification> getMyNotifications(Principal principal) {
        return notificationService.getUserNotifications(principal.getName());
    }

    @PatchMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @GetMapping("/preferences")
    public NotificationPreference getPreferences(Principal principal) {
        return notificationPreferenceService.getOrCreate(principal.getName());
    }

    @PutMapping("/preferences")
    public NotificationPreference updatePreferences(
            Principal principal,
            @RequestBody NotificationPreference request
    ) {
        return notificationPreferenceService.update(principal.getName(), request);
    }
}