package com.campusnexus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 120, message = "Title must be between 5 and 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 15, max = 2000, message = "Description must be between 15 and 2000 characters")
    @Column(length = 2000)
    private String description;

    @NotBlank(message = "Category is required")
    @Pattern(
            regexp = "MAINTENANCE|INCIDENT|SOFTWARE|HARDWARE|NETWORK|OTHER",
            message = "Invalid category"
    )
    private String category;

    @NotBlank(message = "Priority is required")
    @Pattern(
            regexp = "LOW|MEDIUM|HIGH|CRITICAL",
            message = "Invalid priority"
    )
    private String priority;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be less than 200 characters")
    private String location;

    private Long resourceId;

    @NotBlank(message = "Preferred contact name is required")
    @Size(max = 100, message = "Preferred contact name must be less than 100 characters")
    private String preferredContactName;

    @NotBlank(message = "Preferred contact email is required")
    @Email(message = "Preferred contact email is invalid")
    private String preferredContactEmail;

    @NotBlank(message = "Preferred contact phone is required")
    @Pattern(
            regexp = "^[0-9+\\-() ]{7,20}$",
            message = "Preferred contact phone is invalid"
    )
    private String preferredContactPhone;

    @NotBlank(message = "Creator email is required")
    @Email(message = "Creator email is invalid")
    @Column(nullable = false)
    private String createdByEmail;

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "OPEN|IN_PROGRESS|RESOLVED|CLOSED|REJECTED",
            message = "Invalid status"
    )
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    private AppUser assignedStaff;

    @Column(length = 2000)
    @Size(max = 2000, message = "Resolution notes must be less than 2000 characters")
    private String resolutionNotes;

    @Column(length = 500)
    @Size(max = 500, message = "Rejection reason must be less than 500 characters")
    private String rejectionReason;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ticket_images", joinColumns = @JoinColumn(name = "ticket_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Innovation - SLA timer
    private LocalDateTime firstResponseDueAt;
    private LocalDateTime resolutionDueAt;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;

    private Boolean firstResponseBreached = false;
    private Boolean resolutionBreached = false;

    @PrePersist
    public void onCreate() {
        if (status == null || status.isBlank()) {
            status = "OPEN";
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Transient
    public Long getTimeToFirstResponseMinutes() {
        if (createdAt == null || firstResponseAt == null) return null;
        return Duration.between(createdAt, firstResponseAt).toMinutes();
    }

    @Transient
    public Long getTimeToResolutionMinutes() {
        if (createdAt == null || resolvedAt == null) return null;
        return Duration.between(createdAt, resolvedAt).toMinutes();
    }
}