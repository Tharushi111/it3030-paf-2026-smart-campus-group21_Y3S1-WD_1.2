package com.campusnexus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotBlank(message = "User ID is required")
    @Size(max = 50, message = "User ID must not exceed 50 characters")
    private String userId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    @Size(max = 200, message = "Purpose must not exceed 200 characters")
    private String purpose;

    @Min(value = 1, message = "Attendee count must be at least 1")
    private int attendeeCount;

    @NotNull(message = "Booking status is required")
    @NotNull(message = "Booking status is required")
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Size(max = 500, message = "Admin remark must not exceed 500 characters")
    private String adminRemark;


    // ✅ Audit fields (created/updated timestamps)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}