package com.campusnexus.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketAssignRequest {
    @NotNull(message = "Staff ID is required")
    private Long staffId;
}