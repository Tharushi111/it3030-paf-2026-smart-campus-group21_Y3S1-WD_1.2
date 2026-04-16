package com.campusnexus.backend.service;

import com.campusnexus.backend.model.NotificationPreference;
import com.campusnexus.backend.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;

    public NotificationPreference getOrCreate(String email) {
        return preferenceRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    NotificationPreference pref = new NotificationPreference();
                    pref.setUserEmail(email);
                    pref.setBookingNotifications(true);
                    pref.setTicketNotifications(true);
                    pref.setSystemNotifications(true);
                    return preferenceRepository.save(pref);
                });
    }

    public NotificationPreference update(String email, NotificationPreference request) {
        NotificationPreference pref = getOrCreate(email);
        pref.setBookingNotifications(Boolean.TRUE.equals(request.getBookingNotifications()));
        pref.setTicketNotifications(Boolean.TRUE.equals(request.getTicketNotifications()));
        pref.setSystemNotifications(Boolean.TRUE.equals(request.getSystemNotifications()));
        return preferenceRepository.save(pref);
    }
}