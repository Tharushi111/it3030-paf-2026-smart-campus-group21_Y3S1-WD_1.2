package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.BookingDecisionRequest;
import com.campusnexus.backend.dto.BookingRequest;
import com.campusnexus.backend.model.*;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.repository.BookingRepository;
import com.campusnexus.backend.repository.ResourceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;
    private final AppUserRepository appUserRepository;

    public Booking createBooking(Long resourceId, BookingRequest request, String email) {
        validateBookingRequest(request);

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateResourceForBooking(resource, request.getAttendeeCount());
        validateConflicts(
                resourceId,
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        Booking booking = Booking.builder()
                .resourceId(resourceId)
                .userEmail(email.toLowerCase())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose().trim())
                .attendeeCount(request.getAttendeeCount())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);

        notifyAdmins(
                "New booking request created",
                NotificationType.BOOKING_CREATED,
                saved.getId()
        );

        return saved;
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

        Booking updated = bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getUserEmail(),
                "Your booking has been approved",
                NotificationType.BOOKING_APPROVED,
                booking.getId(),
                "BOOKING"
        );

        return updated;
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

        Booking updated = bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getUserEmail(),
                "Your booking has been rejected",
                NotificationType.BOOKING_REJECTED,
                booking.getId(),
                "BOOKING"
        );

        return updated;
    }

    public Booking cancelBooking(Long id, String email, Role role) {
        Booking booking = getBookingById(id);

        boolean owner = booking.getUserEmail().equalsIgnoreCase(email);
        boolean admin = role == Role.ADMIN;

        if (!owner && !admin) {
            throw new AccessDeniedException("Not allowed to cancel booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Booking updated = bookingRepository.save(booking);

        notifyAdmins(
                "Booking cancelled by user",
                NotificationType.BOOKING_CANCELLED,
                updated.getId()
        );

        return updated;
    }

    @Transactional
    public void deleteBooking(Long id, String email, Role role) {
        Booking booking = getBookingById(id);

        boolean owner = booking.getUserEmail().equalsIgnoreCase(email);
        boolean admin = role == Role.ADMIN;

        if (!owner && !admin) {
            throw new AccessDeniedException("Not allowed to delete booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be deleted");
        }

        // Deletes all notifications linked to this booking, including admin notifications
        notificationService.deleteByReference(booking.getId(), "BOOKING");

        bookingRepository.delete(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getMyBookings(String email) {
        return bookingRepository.findByUserEmailOrderByCreatedAtDesc(email.toLowerCase());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public Booking getBookingForViewer(Long id, String email, Role role) {
        Booking booking = getBookingById(id);

        boolean owner = booking.getUserEmail().equalsIgnoreCase(email);
        boolean admin = role == Role.ADMIN;

        if (!owner && !admin) {
            throw new AccessDeniedException("Not allowed to view this booking");
        }

        return booking;
    }

    public Booking updateBooking(Long id,
                                 Long resourceId,
                                 BookingRequest request,
                                 String email,
                                 Role role) {
        validateBookingRequest(request);

        Booking booking = getBookingById(id);

        boolean owner = booking.getUserEmail().equalsIgnoreCase(email);
        boolean admin = role == Role.ADMIN;

        if (!owner && !admin) {
            throw new AccessDeniedException("Not allowed to update booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be updated");
        }

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateResourceForBooking(resource, request.getAttendeeCount());
        validateConflicts(
                resourceId,
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                booking.getId()
        );

        booking.setResourceId(resourceId);
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose().trim());
        booking.setAttendeeCount(request.getAttendeeCount());

        Booking saved = bookingRepository.save(booking);

        notifyAdmins(
                "Booking updated by user",
                NotificationType.BOOKING_UPDATED,
                saved.getId()
        );

        return saved;
    }

    public List<Booking> getByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<Booking> getByDate(LocalDate date) {
        return bookingRepository.findByDateOrderByCreatedAtDesc(date);
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
                        "BOOKING"
                );
            }
        }
    }

    private void validateBookingRequest(BookingRequest request) {
        if (request.getDate() == null) {
            throw new IllegalArgumentException("Date required");
        }

        if (request.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot book past date");
        }

        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("Start/end time required");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start");
        }

        if (request.getPurpose() == null || request.getPurpose().trim().isEmpty()) {
            throw new IllegalArgumentException("Purpose is required");
        }

        if (request.getAttendeeCount() < 1) {
            throw new IllegalArgumentException("Attendee count must be at least 1");
        }
    }

    private void validateResourceForBooking(Resource resource, int attendees) {
        if (!"ACTIVE".equalsIgnoreCase(resource.getStatus())) {
            throw new IllegalArgumentException("Resource not active");
        }

        if (resource.getCapacity() != null && attendees > resource.getCapacity()) {
            throw new IllegalArgumentException("Capacity exceeded");
        }
    }

    private void validateConflicts(Long resourceId,
                                   LocalDate date,
                                   LocalTime start,
                                   LocalTime end,
                                   Long excludeId) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resourceId,
                date,
                start,
                end,
                EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                excludeId
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Booking time conflict");
        }
    }
}