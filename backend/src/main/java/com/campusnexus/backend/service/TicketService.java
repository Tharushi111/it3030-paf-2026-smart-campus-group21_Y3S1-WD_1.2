package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.TicketStatusUpdateRequest;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AppUserRepository appUserRepository;

    @Value("${app.ticket.upload.dir:uploads/tickets}")
    private String ticketUploadDir;

    public TicketService(TicketRepository ticketRepository, AppUserRepository appUserRepository) {
        this.ticketRepository = ticketRepository;
        this.appUserRepository = appUserRepository;
    }

    public Ticket createTicket(Ticket ticket, MultipartFile[] images) {
        validateTicket(ticket, images);

        ticket.setStatus("OPEN");
        ticket.setAssignedStaff(null);
        ticket.setResolutionNotes(null);
        ticket.setRejectionReason(null);
        setSlaDeadlines(ticket);

        if (images != null && images.length > 0) {
            ticket.setImageUrls(saveImages(images));
        } else {
            ticket.setImageUrls(new ArrayList<>());
        }

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getMyTickets(String email) {
        return ticketRepository.findByCreatedByEmailOrderByCreatedAtDesc(email);
    }

    public List<Ticket> getAssignedTickets(String email) {
        return ticketRepository.findByAssignedStaffEmailOrderByCreatedAtDesc(email);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public Ticket updateTicket(Long id, Ticket updatedTicket, MultipartFile[] images, String currentUserEmail) {
        Ticket existingTicket = getTicketById(id);

        if (!existingTicket.getCreatedByEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("You can update only your own ticket");
        }

        if (existingTicket.getAssignedStaff() != null) {
            throw new RuntimeException("You cannot edit this ticket after a staff member has been assigned");
        }

        if (!"OPEN".equals(existingTicket.getStatus()) && !"REJECTED".equals(existingTicket.getStatus())) {
            throw new RuntimeException("Only OPEN or REJECTED tickets can be edited");
        }

        validateTicket(updatedTicket, images);

        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());
        existingTicket.setCategory(updatedTicket.getCategory());
        existingTicket.setPriority(updatedTicket.getPriority());
        existingTicket.setLocation(updatedTicket.getLocation());
        existingTicket.setPreferredContactName(updatedTicket.getPreferredContactName());
        existingTicket.setPreferredContactEmail(updatedTicket.getPreferredContactEmail());
        existingTicket.setPreferredContactPhone(updatedTicket.getPreferredContactPhone());

        setSlaDeadlines(existingTicket);

        if (images != null && images.length > 0) {
            deleteImageFiles(existingTicket.getImageUrls());
            existingTicket.setImageUrls(saveImages(images));
        }

        return ticketRepository.save(existingTicket);
    }

    public void deleteTicket(Long id, String currentUserEmail) {
        Ticket ticket = getTicketById(id);

        if (!ticket.getCreatedByEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("You can delete only your own ticket");
        }

        if (ticket.getAssignedStaff() != null) {
            throw new RuntimeException("You cannot delete this ticket after a staff member has been assigned");
        }

        if (!"OPEN".equals(ticket.getStatus()) && !"REJECTED".equals(ticket.getStatus())) {
            throw new RuntimeException("Only OPEN or REJECTED tickets can be deleted");
        }

        deleteImageFiles(ticket.getImageUrls());
        ticketRepository.deleteById(id);
    }

    public Ticket assignTicket(Long ticketId, Long staffId) {
        Ticket ticket = getTicketById(ticketId);

        AppUser staff = appUserRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff user not found"));

        if (staff.getRole() != Role.STAFF) {
            throw new RuntimeException("Selected user is not a STAFF member");
        }

        ticket.setAssignedStaff(staff);
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long id, TicketStatusUpdateRequest request, String currentUserEmail, boolean isAdmin) {
        Ticket ticket = getTicketById(id);

        boolean isAssignedStaff =
                ticket.getAssignedStaff() != null &&
                ticket.getAssignedStaff().getEmail() != null &&
                ticket.getAssignedStaff().getEmail().equalsIgnoreCase(currentUserEmail);

        if (!isAdmin && !isAssignedStaff) {
            throw new RuntimeException("Only assigned staff or admin can update this ticket");
        }

        String newStatus = request.getStatus();
        validateStatusTransition(ticket.getStatus(), newStatus, isAdmin);

        ticket.setStatus(newStatus);

        if ("IN_PROGRESS".equals(newStatus) && ticket.getFirstResponseAt() == null) {
            ticket.setFirstResponseAt(LocalDateTime.now());
            ticket.setFirstResponseBreached(
                    ticket.getFirstResponseDueAt() != null &&
                    LocalDateTime.now().isAfter(ticket.getFirstResponseDueAt())
            );
        }

        if ("RESOLVED".equals(newStatus) || "CLOSED".equals(newStatus)) {
            if (ticket.getFirstResponseAt() == null) {
                ticket.setFirstResponseAt(LocalDateTime.now());
            }

            ticket.setResolvedAt(LocalDateTime.now());
            ticket.setResolutionBreached(
                    ticket.getResolutionDueAt() != null &&
                    LocalDateTime.now().isAfter(ticket.getResolutionDueAt())
            );
        }

        if (request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        if (request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }

        return ticketRepository.save(ticket);
    }

    public List<AppUser> getAllStaffUsers() {
        return appUserRepository.findByRole(Role.STAFF);
    }

    private void validateTicket(Ticket ticket, MultipartFile[] images) {
        if (ticket == null) {
            throw new IllegalArgumentException("Ticket data is required");
        }

        if (images != null && images.length > 3) {
            throw new IllegalArgumentException("A ticket can include up to 3 image attachments only");
        }

        if (images != null) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    validateSingleImage(image);
                }
            }
        }
    }

    private void validateSingleImage(MultipartFile image) {
        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        long maxSize = 5 * 1024 * 1024;
        if (image.getSize() > maxSize) {
            throw new IllegalArgumentException("Each image must be 5MB or less");
        }
    }

    private void setSlaDeadlines(Ticket ticket) {
        LocalDateTime now = LocalDateTime.now();

        switch (ticket.getPriority()) {
            case "CRITICAL" -> {
                ticket.setFirstResponseDueAt(now.plusHours(1));
                ticket.setResolutionDueAt(now.plusHours(8));
            }
            case "HIGH" -> {
                ticket.setFirstResponseDueAt(now.plusHours(4));
                ticket.setResolutionDueAt(now.plusHours(24));
            }
            case "MEDIUM" -> {
                ticket.setFirstResponseDueAt(now.plusHours(8));
                ticket.setResolutionDueAt(now.plusDays(2));
            }
            default -> {
                ticket.setFirstResponseDueAt(now.plusHours(12));
                ticket.setResolutionDueAt(now.plusDays(3));
            }
        }
    }

    private void validateStatusTransition(String currentStatus, String newStatus, boolean isAdmin) {
        if (currentStatus == null) currentStatus = "OPEN";

        switch (currentStatus) {
            case "OPEN" -> {
                if (!List.of("IN_PROGRESS", "REJECTED").contains(newStatus)) {
                    throw new IllegalArgumentException("OPEN ticket can only move to IN_PROGRESS or REJECTED");
                }
            }
            case "IN_PROGRESS" -> {
                if (!List.of("RESOLVED", "REJECTED").contains(newStatus)) {
                    throw new IllegalArgumentException("IN_PROGRESS ticket can only move to RESOLVED or REJECTED");
                }
            }
            case "RESOLVED" -> {
                if (!"CLOSED".equals(newStatus) && !(isAdmin && "REJECTED".equals(newStatus))) {
                    throw new IllegalArgumentException("RESOLVED ticket can only move to CLOSED");
                }
            }
            case "CLOSED", "REJECTED" -> throw new IllegalArgumentException("Closed or rejected tickets cannot be updated further");
            default -> throw new IllegalArgumentException("Invalid current ticket status");
        }
    }

    private List<String> saveImages(MultipartFile[] images) {
        try {
            Path uploadPath = Paths.get(ticketUploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile image : images) {
                if (image == null || image.isEmpty()) continue;

                String originalName = StringUtils.cleanPath(image.getOriginalFilename());
                String extension = "";

                int dotIndex = originalName.lastIndexOf(".");
                if (dotIndex >= 0) {
                    extension = originalName.substring(dotIndex);
                }

                String fileName = UUID.randomUUID() + extension;
                Path filePath = uploadPath.resolve(fileName);

                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                imageUrls.add("/uploads/tickets/" + fileName);
            }

            return imageUrls;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store ticket images", e);
        }
    }

    private void deleteImageFiles(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) return;

        for (String imageUrl : imageUrls) {
            try {
                String fileName = imageUrl.replace("/uploads/tickets/", "");
                Path filePath = Paths.get(ticketUploadDir).resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (Exception ignored) {
            }
        }
    }
}