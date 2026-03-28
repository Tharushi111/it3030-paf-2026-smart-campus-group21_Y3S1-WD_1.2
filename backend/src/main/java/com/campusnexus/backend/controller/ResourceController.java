package com.campusnexus.backend.controller;

import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.service.ResourceService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(service.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        Resource resource = service.getResourceById(id);
        if (resource != null) {
            return ResponseEntity.ok(resource);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Resource> createResource(
            @RequestParam @NotBlank(message = "Resource name is required") String name,
            @RequestParam @NotBlank(message = "Resource type is required") String type,
            @RequestParam @Min(value = 1, message = "Capacity must be at least 1") Integer capacity,
            @RequestParam @NotBlank(message = "Location is required") String location,
            @RequestParam @NotBlank(message = "Status is required") String status,
            @RequestParam(required = false) MultipartFile image
    ) {
        Resource saved = service.createResource(name, type, capacity, location, status, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long id,
            @RequestParam @NotBlank(message = "Resource name is required") String name,
            @RequestParam @NotBlank(message = "Resource type is required") String type,
            @RequestParam @Min(value = 1, message = "Capacity must be at least 1") Integer capacity,
            @RequestParam @NotBlank(message = "Location is required") String location,
            @RequestParam @NotBlank(message = "Status is required") String status,
            @RequestParam(required = false) MultipartFile image
    ) {
        Resource updated = service.updateResource(id, name, type, capacity, location, status, image);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        boolean deleted = service.deleteResource(id);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}