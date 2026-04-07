package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.TicketStatusUpdateRequest;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.NotificationType;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AppUserRepository appUserRepository;
    private final NotificationService notificationService;

    public Ticket createTicket(Ticket ticket, MultipartFile[] images) {
        ticket.setStatus("OPEN");

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

        Ticket saved = ticketRepository.save(ticket);

        notifyAdmins(
                "Ticket details updated: " + saved.getTitle(),
                NotificationType.TICKET_UPDATED,
                saved.getId()
        );

        return saved;
    }

    public void deleteTicket(Long id, String email) {
        Ticket ticket = getTicketById(id);

        if (!ticket.getCreatedByEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Not allowed");
        }

        notificationService.deleteByReference(ticket.getId(), "TICKET");

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
}