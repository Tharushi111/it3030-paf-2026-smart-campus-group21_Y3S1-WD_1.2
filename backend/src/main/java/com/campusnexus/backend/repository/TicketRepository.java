package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedByEmailOrderByCreatedAtDesc(String createdByEmail);
    List<Ticket> findByAssignedStaffEmailOrderByCreatedAtDesc(String email);
}