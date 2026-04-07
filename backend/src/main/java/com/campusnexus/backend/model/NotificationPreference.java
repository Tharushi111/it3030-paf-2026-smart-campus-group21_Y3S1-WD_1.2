package com.campusnexus.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "notification_preferences")
@Data
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Boolean bookingNotifications = true;

    private Boolean ticketNotifications = true;

    private Boolean systemNotifications = true;
}