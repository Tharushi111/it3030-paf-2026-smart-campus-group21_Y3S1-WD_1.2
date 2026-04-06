package com.campusnexus.backend.controller;

import com.campusnexus.backend.dto.TicketAssignRequest;
import com.campusnexus.backend.dto.TicketStatusUpdateRequest;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TicketController {

    private final TicketService ticketService;
    private final AppUserRepository appUserRepository;

    public TicketController(TicketService ticketService, AppUserRepository appUserRepository) {
        this.ticketService = ticketService;
        this.appUserRepository = appUserRepository;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Ticket> createTicket(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String priority,
            @RequestParam String location,
            @RequestParam(required = false) Long resourceId,
            @RequestParam String preferredContactName,
            @RequestParam String preferredContactEmail,
            @RequestParam String preferredContactPhone,
            @RequestParam(required = false) MultipartFile[] images,
            Authentication authentication
    ) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setLocation(location);
        ticket.setResourceId(resourceId);
        ticket.setPreferredContactName(preferredContactName);
        ticket.setPreferredContactEmail(preferredContactEmail);
        ticket.setPreferredContactPhone(preferredContactPhone);
        ticket.setCreatedByEmail(extractCurrentUserEmail(authentication));

        Ticket saved = ticketService.createTicket(ticket, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Authentication authentication) {
        String email = extractCurrentUserEmail(authentication);
        return ResponseEntity.ok(ticketService.getMyTickets(email));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets(Authentication authentication) {
        String email = extractCurrentUserEmail(authentication);
        return ResponseEntity.ok(ticketService.getAssignedTickets(email));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<AppUser>> getAllStaffUsers() {
        return ResponseEntity.ok(ticketService.getAllStaffUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String priority,
            @RequestParam String location,
            @RequestParam(required = false) Long resourceId,
            @RequestParam String preferredContactName,
            @RequestParam String preferredContactEmail,
            @RequestParam String preferredContactPhone,
            @RequestParam(required = false) MultipartFile[] images,
            Authentication authentication
    ) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setLocation(location);
        ticket.setResourceId(resourceId);
        ticket.setPreferredContactName(preferredContactName);
        ticket.setPreferredContactEmail(preferredContactEmail);
        ticket.setPreferredContactPhone(preferredContactPhone);

        return ResponseEntity.ok(
                ticketService.updateTicket(id, ticket, images, extractCurrentUserEmail(authentication))
        );
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketAssignRequest request
    ) {
        return ResponseEntity.ok(ticketService.assignTicket(id, request.getStaffId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request,
            Authentication authentication
    ) {
        AppUser currentUser = getCurrentUser(authentication);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        return ResponseEntity.ok(
                ticketService.updateTicketStatus(id, request, currentUser.getEmail(), isAdmin)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            Authentication authentication
    ) {
        ticketService.deleteTicket(id, extractCurrentUserEmail(authentication));
        return ResponseEntity.noContent().build();
    }

    private String extractCurrentUserEmail(Authentication authentication) {
        return getCurrentUser(authentication).getEmail();
    }

    private AppUser getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
            throw new RuntimeException("Unauthorized");
        }

        String email = oauth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Authenticated user email not found");
        }

        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found in database"));
    }
}