package com.campusnexus.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "OPEN|IN_PROGRESS|RESOLVED|CLOSED|REJECTED",
            message = "Invalid status"
    )
    private String status;

    @Size(max = 2000, message = "Resolution notes must be less than 2000 characters")
    private String resolutionNotes;

    @Size(max = 500, message = "Rejection reason must be less than 500 characters")
    private String rejectionReason;
}