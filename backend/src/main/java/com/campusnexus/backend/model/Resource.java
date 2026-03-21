package com.campusnexus.backend.model;

import jakarta.persistence.*;
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

    private String name;
    private String type;      // e.g., Lab, Room, Projector
    private Integer capacity;
    private String location;
    private String status;    // ACTIVE / OUT_OF_SERVICE
}