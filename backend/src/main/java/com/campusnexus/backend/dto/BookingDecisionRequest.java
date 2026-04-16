package com.campusnexus.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookingDecisionRequest {

    @Size(max = 500, message = "Admin remark must not exceed 500 characters")
    private String adminRemark;
}