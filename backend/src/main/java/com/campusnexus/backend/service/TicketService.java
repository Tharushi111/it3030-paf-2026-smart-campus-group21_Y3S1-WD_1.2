package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        if (ticket.getStatus() == null || ticket.getStatus().isEmpty()) {
            ticket.setStatus("OPEN");
        }
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public Ticket updateTicket(Long id, Ticket updatedTicket) {
        Ticket existingTicket = getTicketById(id);
        
        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());
        existingTicket.setCategory(updatedTicket.getCategory());
        existingTicket.setPriority(updatedTicket.getPriority());
        existingTicket.setLocation(updatedTicket.getLocation());
        existingTicket.setResourceId(updatedTicket.getResourceId());
        
        return ticketRepository.save(existingTicket);
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public Ticket updateTicketStatus(Long id, Map<String, String> updates) {
        Ticket ticket = getTicketById(id);
        if (updates.containsKey("status")) {
            ticket.setStatus(updates.get("status"));
        }
        if (updates.containsKey("resolutionNotes")) {
            ticket.setResolutionNotes(updates.get("resolutionNotes"));
        }
        return ticketRepository.save(ticket);
    }

    public Ticket assignTicket(Long id, Map<String, String> updates) {
        Ticket ticket = getTicketById(id);
        if (updates.containsKey("assignedTo")) {
            ticket.setAssignedTo(updates.get("assignedTo"));
        }
        return ticketRepository.save(ticket);
    }
}
