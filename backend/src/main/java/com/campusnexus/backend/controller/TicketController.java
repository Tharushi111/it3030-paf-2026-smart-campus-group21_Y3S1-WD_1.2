package com.campusnexus.backend.controller;

import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.createTicket(ticket);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable("id") Long id,
            @Valid @RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable("id") Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, updates));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTicket(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(ticketService.assignTicket(id, updates));
    }
}
