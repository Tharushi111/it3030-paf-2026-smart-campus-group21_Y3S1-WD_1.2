package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ResourceService {

    private final ResourceRepository repository;

    @Value("${app.upload.dir}")
    private String uploadDir;

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

        Resource resource = new Resource();
        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setStatus(status);

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

        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setStatus(status);

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

    private String saveImage(MultipartFile image) {
        try {
            String contentType = image.getContentType();

            if (contentType == null ||
                    (!contentType.equals("image/jpeg")
                            && !contentType.equals("image/png")
                            && !contentType.equals("image/jpg")
                            && !contentType.equals("image/webp"))) {
                throw new RuntimeException("Only JPG, JPEG, PNG, and WEBP images are allowed");
            }

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