package com.campusnexus.backend.controller;

import com.campusnexus.backend.dto.SystemNotificationRequest;
import com.campusnexus.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;

    @PostMapping("/system")
    public void sendSystemNotification(@Valid @RequestBody SystemNotificationRequest request) {
        notificationService.sendSystemNotificationToAll(request.getMessage());
    }
}