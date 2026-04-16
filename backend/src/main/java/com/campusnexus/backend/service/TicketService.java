package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.TicketStatusUpdateRequest;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.NotificationType;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.repository.TicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AppUserRepository appUserRepository;
    private final NotificationService notificationService;

    @Value("${app.ticket.upload.dir}")
    private String ticketUploadDir;

    public Ticket createTicket(Ticket ticket, MultipartFile[] images) {
        ticket.setStatus("OPEN");

        if (images != null && images.length > 0) {
            ticket.setImageUrls(saveTicketImages(images));
        }

        Ticket saved = ticketRepository.save(ticket);

        notifyAdmins(
                "New ticket submitted: " + saved.getTitle(),
                NotificationType.TICKET_CREATED,
                saved.getId()
        );

        return saved;
    }

    public Ticket assignTicket(Long ticketId, Long staffId) {
        Ticket ticket = getTicketById(ticketId);

        AppUser staff = appUserRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        ticket.setAssignedStaff(staff);

        Ticket updated = ticketRepository.save(ticket);

        notificationService.sendNotification(
                staff.getEmail(),
                "A ticket has been assigned to you",
                NotificationType.TICKET_ASSIGNED,
                ticket.getId(),
                "TICKET"
        );

        return updated;
    }

    public Ticket updateTicketStatus(Long id,
                                     TicketStatusUpdateRequest request,
                                     String userEmail,
                                     boolean isAdmin) {
        Ticket ticket = getTicketById(id);

        ticket.setStatus(request.getStatus());

        if ("RESOLVED".equals(request.getStatus()) ||
                "CLOSED".equals(request.getStatus())) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket updated = ticketRepository.save(ticket);

        notificationService.sendNotification(
                ticket.getCreatedByEmail(),
                "Ticket status changed to " + ticket.getStatus(),
                NotificationType.TICKET_STATUS_CHANGED,
                ticket.getId(),
                "TICKET"
        );

        notifyAdmins(
                "Ticket updated: " + ticket.getTitle() + " -> " + ticket.getStatus(),
                NotificationType.TICKET_STATUS_CHANGED,
                ticket.getId()
        );

        return updated;
    }

    public Ticket updateTicket(Long id,
                               Ticket updated,
                               MultipartFile[] images,
                               String email) {
        Ticket ticket = getTicketById(id);

        if (!ticket.getCreatedByEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Not allowed");
        }

        ticket.setTitle(updated.getTitle());
        ticket.setDescription(updated.getDescription());
        ticket.setCategory(updated.getCategory());
        ticket.setPriority(updated.getPriority());
        ticket.setLocation(updated.getLocation());
        ticket.setResourceId(updated.getResourceId());
        ticket.setPreferredContactName(updated.getPreferredContactName());
        ticket.setPreferredContactEmail(updated.getPreferredContactEmail());
        ticket.setPreferredContactPhone(updated.getPreferredContactPhone());

        if (images != null && images.length > 0 && !images[0].isEmpty()) {
            deleteTicketImages(ticket.getImageUrls());
            ticket.setImageUrls(saveTicketImages(images));
        }

        Ticket saved = ticketRepository.save(ticket);

        notifyAdmins(
                "Ticket details updated: " + saved.getTitle(),
                NotificationType.TICKET_UPDATED,
                saved.getId()
        );

        return saved;
    }

    @Transactional
    public void deleteTicket(Long id, String email) {
        Ticket ticket = getTicketById(id);

        if (!ticket.getCreatedByEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Not allowed");
        }

        notificationService.deleteByReference(ticket.getId(), "TICKET");
        deleteTicketImages(ticket.getImageUrls());
        ticketRepository.delete(ticket);
    }

    public List<AppUser> getAllStaffUsers() {
        return appUserRepository.findByRole(Role.STAFF);
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
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    private void notifyAdmins(String message, NotificationType type, Long refId) {
        List<AppUser> admins = appUserRepository.findByRole(Role.ADMIN);

        for (AppUser admin : admins) {
            if (admin.getEmail() != null && !admin.getEmail().isBlank()) {
                notificationService.sendNotification(
                        admin.getEmail(),
                        message,
                        type,
                        refId,
                        "TICKET"
                );
            }
        }
    }

    private List<String> saveTicketImages(MultipartFile[] images) {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            if (image == null || image.isEmpty()) {
                continue;
            }

            validateImage(image);
            imageUrls.add(saveSingleImage(image));
        }

        if (imageUrls.size() > 3) {
            throw new IllegalArgumentException("You can upload up to 3 images only");
        }

        return imageUrls;
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
            throw new IllegalArgumentException("Each image must be less than 5MB");
        }
    }

    private String saveSingleImage(MultipartFile image) {
        try {
            Path uploadPath = Paths.get(ticketUploadDir.trim()).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = image.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/tickets/" + fileName;

        } catch (InvalidPathException e) {
            throw new RuntimeException("Invalid ticket upload path: " + ticketUploadDir, e);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save ticket image", e);
        }
    }

    private void deleteTicketImages(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (String imageUrl : imageUrls) {
            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }

            try {
                String fileName = imageUrl.replace("/uploads/tickets/", "");
                Path filePath = Paths.get(ticketUploadDir.trim()).toAbsolutePath().normalize().resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete ticket image", e);
            }
        }
    }
}