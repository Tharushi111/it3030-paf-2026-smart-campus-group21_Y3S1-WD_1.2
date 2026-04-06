package com.campusnexus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Resource ID is required")
    @Column(nullable = false)
    private Long resourceId;

    @NotBlank(message = "User email is required")
    @Email(message = "User email must be valid")
    @Size(max = 100, message = "User email must not exceed 100 characters")
    @Column(name = "user_id", nullable = false, length = 100)
    private String userEmail;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotNull(message = "Start time is required")
    @Column(nullable = false)
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @Column(nullable = false)
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    @Size(max = 200, message = "Purpose must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String purpose;

    @Min(value = 1, message = "Attendee count must be at least 1")
    @Column(nullable = false)
    private int attendeeCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Size(max = 500, message = "Admin remark must not exceed 500 characters")
    @Column(length = 500)
    private String adminRemark;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = BookingStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}