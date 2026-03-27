package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repository;

    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public Resource getResourceById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Resource createResource(Resource resource) {
        return repository.save(resource);
    }

    public Resource updateResource(Long id, Resource resourceDetails) {
        Resource resource = repository.findById(id).orElse(null);

        if (resource != null) {
            resource.setName(resourceDetails.getName());
            resource.setType(resourceDetails.getType());
            resource.setCapacity(resourceDetails.getCapacity());
            resource.setLocation(resourceDetails.getLocation());
            resource.setStatus(resourceDetails.getStatus());

            return repository.save(resource);
        }

        return null;
    }

    public boolean deleteResource(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}