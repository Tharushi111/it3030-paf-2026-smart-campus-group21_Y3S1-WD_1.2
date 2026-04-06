package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.BookingDecisionRequest;
import com.campusnexus.backend.dto.BookingRequest;
import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.repository.BookingRepository;
import com.campusnexus.backend.repository.ResourceRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository,
                          ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    public Booking createBooking(Long resourceId, BookingRequest request, String userEmail) {
        validateBookingRequest(request);

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateResourceForBooking(resource, request.getAttendeeCount());
        validateConflicts(resourceId, request.getDate(), request.getStartTime(), request.getEndTime(), null);

        Booking booking = Booking.builder()
                .resourceId(resourceId)
                .userEmail(userEmail.toLowerCase())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose().trim())
                .attendeeCount(request.getAttendeeCount())
                .status(BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id,
                                 Long resourceId,
                                 BookingRequest request,
                                 String userEmail,
                                 Role role) {
        validateBookingRequest(request);

        Booking existing = getBookingById(id);

        boolean isOwner = existing.getUserEmail().equalsIgnoreCase(userEmail);
        boolean isAdmin = role == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You are not allowed to update this booking");
        }

        // User or admin can update only before approval
        if (existing.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be updated");
        }

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateResourceForBooking(resource, request.getAttendeeCount());
        validateConflicts(resourceId, request.getDate(), request.getStartTime(), request.getEndTime(), existing.getId());

        existing.setResourceId(resourceId);
        existing.setDate(request.getDate());
        existing.setStartTime(request.getStartTime());
        existing.setEndTime(request.getEndTime());
        existing.setPurpose(request.getPurpose().trim());
        existing.setAttendeeCount(request.getAttendeeCount());

        return bookingRepository.save(existing);
    }

    public List<Booking> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmailOrderByCreatedAtDesc(userEmail.toLowerCase());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<Booking> getByDate(LocalDate date) {
        return bookingRepository.findByDateOrderByCreatedAtDesc(date);
    }

    public Booking getBookingForViewer(Long id, String userEmail, Role role) {
        Booking booking = getBookingById(id);

        boolean isOwner = booking.getUserEmail().equalsIgnoreCase(userEmail);
        boolean isAdmin = role == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You are not allowed to view this booking");
        }

        return booking;
    }

    public Booking approveBooking(Long id, BookingDecisionRequest request) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() == BookingStatus.APPROVED) {
            throw new RuntimeException("Booking is already approved");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cancelled booking cannot be approved");
        }

        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new RuntimeException("Rejected booking cannot be approved");
        }

        validateConflicts(
                booking.getResourceId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getId()
        );

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminRemark(request != null ? request.getAdminRemark() : null);

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, BookingDecisionRequest request) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() == BookingStatus.APPROVED) {
            throw new RuntimeException("Approved booking cannot be rejected");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cancelled booking cannot be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminRemark(request != null ? request.getAdminRemark() : null);

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id, String userEmail, Role role) {
        Booking booking = getBookingById(id);

        boolean isOwner = booking.getUserEmail().equalsIgnoreCase(userEmail);
        boolean isAdmin = role == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You are not allowed to cancel this booking");
        }

        // Before approval only
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id, String userEmail, Role role) {
        Booking booking = getBookingById(id);

        boolean isOwner = booking.getUserEmail().equalsIgnoreCase(userEmail);
        boolean isAdmin = role == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You are not allowed to delete this booking");
        }

        // Before approval only
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be deleted");
        }

        bookingRepository.delete(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private void validateBookingRequest(BookingRequest request) {
        if (request.getDate() == null) {
            throw new IllegalArgumentException("Date is required");
        }

        if (request.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Booking date cannot be in the past");
        }

        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        if (request.getPurpose() == null || request.getPurpose().trim().isEmpty()) {
            throw new IllegalArgumentException("Purpose is required");
        }

        if (request.getAttendeeCount() < 1) {
            throw new IllegalArgumentException("Attendee count must be at least 1");
        }
    }

    private void validateResourceForBooking(Resource resource, int attendeeCount) {
        if (resource.getStatus() == null || !"ACTIVE".equalsIgnoreCase(resource.getStatus())) {
            throw new IllegalArgumentException("Only ACTIVE resources can be booked");
        }

        if (resource.getCapacity() != null && attendeeCount > resource.getCapacity()) {
            throw new IllegalArgumentException("Attendee count exceeds resource capacity");
        }
    }

    private void validateConflicts(Long resourceId,
                                   LocalDate date,
                                   LocalTime startTime,
                                   LocalTime endTime,
                                   Long excludeId) {

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resourceId,
                date,
                startTime,
                endTime,
                EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                excludeId
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Selected time slot conflicts with an existing booking");
        }
    }
}