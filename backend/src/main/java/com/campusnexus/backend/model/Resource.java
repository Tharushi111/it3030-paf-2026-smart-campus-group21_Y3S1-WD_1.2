package com.campusnexus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Resource name is required")
    @Size(max = 100, message = "Resource name must not exceed 100 characters")
    @Pattern(
            regexp = "^[a-zA-Z0-9\\s\\-_.',()]+$",
            message = "Resource name contains invalid characters"
    )
    private String name;

    @NotBlank(message = "Resource type is required")
    private String type;

    // Capacity is optional for equipment types
    private Integer capacity;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    @Pattern(
            regexp = "^[a-zA-Z0-9\\s\\-_.',()]+$",
            message = "Location contains invalid characters"
    )
    private String location;

    @NotBlank(message = "Status is required")
    private String status;

    private String imageUrl;
}