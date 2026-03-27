package com.campusnexus.backend.controller;

import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public List<Resource> getAllResources() {
        return service.getAllResources();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id){
        Resource resource = service.getResourceById(id);
        if(resource != null){
            return ResponseEntity.ok(resource);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Resource createResource(@RequestBody Resource resource){
        return service.createResource(resource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resource){
        Resource updated = service.updateResource(id, resource);
        if(updated != null){
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id){
        boolean deleted = service.deleteResource(id);
        if(deleted){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}