package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ResourceService {

    private final ResourceRepository repository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "LAB",
            "LECTURE_HALL",
            "AUDITORIUM",
            "LIBRARY_FLOOR",
            "STUDY_AREA",
            "OPEN_STUDY_AREA",
            "CANTEEN",
            "CAFETERIA",
            "PROJECTOR",
            "CAMERA",
            "PRINTER",
            "SCANNER",
            "MICROPHONE",
            "SPEAKER",
            "SMART_BOARD",
            "LAB_EQUIPMENT"
    );

    private static final Set<String> NON_CAPACITY_TYPES = Set.of(
            "PROJECTOR",
            "CAMERA",
            "PRINTER",
            "SCANNER",
            "MICROPHONE",
            "SPEAKER",
            "SMART_BOARD",
            "LAB_EQUIPMENT"
    );

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "ACTIVE",
            "OUT_OF_SERVICE"
    );

    private static final Pattern TEXT_PATTERN =
            Pattern.compile("^[a-zA-Z0-9\\s\\-_.',()]+$");

    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public Resource getResourceById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Resource createResource(String name,
                                   String type,
                                   Integer capacity,
                                   String location,
                                   String status,
                                   MultipartFile image) {

        validateResourceFields(name, type, capacity, location, status, image);

        Resource resource = new Resource();
        resource.setName(name.trim());
        resource.setType(type.trim());
        resource.setCapacity(normalizeCapacity(type, capacity));
        resource.setLocation(location.trim());
        resource.setStatus(status.trim());

        if (image != null && !image.isEmpty()) {
            resource.setImageUrl(saveImage(image));
        }

        return repository.save(resource);
    }

    public Resource updateResource(Long id,
                                   String name,
                                   String type,
                                   Integer capacity,
                                   String location,
                                   String status,
                                   MultipartFile image) {

        Resource resource = repository.findById(id).orElse(null);

        if (resource == null) {
            return null;
        }

        validateResourceFields(name, type, capacity, location, status, image);

        resource.setName(name.trim());
        resource.setType(type.trim());
        resource.setCapacity(normalizeCapacity(type, capacity));
        resource.setLocation(location.trim());
        resource.setStatus(status.trim());

        if (image != null && !image.isEmpty()) {
            deleteImageIfExists(resource.getImageUrl());
            resource.setImageUrl(saveImage(image));
        }

        return repository.save(resource);
    }

    public boolean deleteResource(Long id) {
        if (repository.existsById(id)) {
            Resource resource = repository.findById(id).orElse(null);

            if (resource != null) {
                deleteImageIfExists(resource.getImageUrl());
            }

            repository.deleteById(id);
            return true;
        }
        return false;
    }

    private void validateResourceFields(String name,
                                        String type,
                                        Integer capacity,
                                        String location,
                                        String status,
                                        MultipartFile image) {

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Resource name is required");
        }

        if (name.length() > 100) {
            throw new IllegalArgumentException("Resource name must not exceed 100 characters");
        }

        if (!TEXT_PATTERN.matcher(name).matches()) {
            throw new IllegalArgumentException("Resource name contains invalid characters");
        }

        if (type == null || type.trim().isEmpty()) {
            throw new IllegalArgumentException("Resource type is required");
        }

        if (!ALLOWED_TYPES.contains(type.trim())) {
            throw new IllegalArgumentException("Invalid resource type");
        }

        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Location is required");
        }

        if (location.length() > 200) {
            throw new IllegalArgumentException("Location must not exceed 200 characters");
        }

        if (!TEXT_PATTERN.matcher(location).matches()) {
            throw new IllegalArgumentException("Location contains invalid characters");
        }

        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }

        if (!ALLOWED_STATUSES.contains(status.trim())) {
            throw new IllegalArgumentException("Invalid status");
        }

        if (!NON_CAPACITY_TYPES.contains(type.trim())) {
            if (capacity == null) {
                throw new IllegalArgumentException("Capacity is required for this resource type");
            }

            if (capacity < 1) {
                throw new IllegalArgumentException("Capacity must be at least 1");
            }
        }

        if (image != null && !image.isEmpty()) {
            validateImage(image);
        }
    }

    private Integer normalizeCapacity(String type, Integer capacity) {
        if (NON_CAPACITY_TYPES.contains(type.trim())) {
            return null;
        }
        return capacity;
    }

    private void validateImage(MultipartFile image) {
        String contentType = image.getContentType();

        if (contentType == null || (!contentType.equals("image/jpeg")
                && !contentType.equals("image/png")
                && !contentType.equals("image/jpg")
                && !contentType.equals("image/webp")
                && !contentType.equals("image/gif"))) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG, GIF, and WEBP images are allowed");
        }

        long maxSize = 5 * 1024 * 1024;
        if (image.getSize() > maxSize) {
            throw new IllegalArgumentException("Image size must be less than 5MB");
        }
    }

    private String saveImage(MultipartFile image) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = image.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save image");
        }
    }

    private void deleteImageIfExists(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        try {
            String fileName = imageUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete old image");
        }
    }
}