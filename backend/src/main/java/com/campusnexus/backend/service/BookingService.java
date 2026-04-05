package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.campusnexus.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Conflict checking
    private boolean isConflict(Long resourceId,
                               LocalDate date,
                               LocalTime start,
                               LocalTime end) {

        List<Booking> bookings =
                bookingRepository.findByResourceIdAndDate(resourceId, date);

        for (Booking b : bookings) {
            if (b.getStatus() == BookingStatus.APPROVED) {
                if (start.isBefore(b.getEndTime()) &&
                    end.isAfter(b.getStartTime())) {
                    return true;
                }
            }
        }
        return false;
    }

    // ✅ Create booking
    public Booking createBooking(Booking booking) {

        // Time validation
        if (booking.getEndTime().isBefore(booking.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        // Conflict check
        if (isConflict(booking.getResourceId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime())) {

            throw new RuntimeException("Time slot already booked!");
        }

        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING);
        }

        return bookingRepository.save(booking);
    }

    // ✅ Update booking
    public Booking updateBooking(Long id, Booking updated) {

        Booking existing = getBookingById(id);

        if (updated.getEndTime().isBefore(updated.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        if (isConflict(updated.getResourceId(),
                updated.getDate(),
                updated.getStartTime(),
                updated.getEndTime())) {

            throw new RuntimeException("Time slot already booked!");
        }

        existing.setResourceId(updated.getResourceId());
        existing.setDate(updated.getDate());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setPurpose(updated.getPurpose());
        existing.setAttendeeCount(updated.getAttendeeCount());

        return bookingRepository.save(existing);
    }

    // ✅ Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ✅ Get bookings by user, oldest first
    public List<Booking> getBookingsByUserSorted(String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);

        bookings.sort((b1, b2) -> {
        LocalDateTime dt1 = (b1.getDate() != null && b1.getStartTime() != null)
                ? LocalDateTime.of(b1.getDate(), b1.getStartTime())
                : LocalDateTime.MIN;

        LocalDateTime dt2 = (b2.getDate() != null && b2.getStartTime() != null)
                ? LocalDateTime.of(b2.getDate(), b2.getStartTime())
                : LocalDateTime.MIN;

        return dt1.compareTo(dt2); // oldest first
    });

    return bookings;
    }
        
        

    // ✅ Get booking by ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // ✅ Approve with conflict check
    public Booking approveBooking(Long id) {

        Booking b = getBookingById(id);

        if (isConflict(b.getResourceId(),
                b.getDate(),
                b.getStartTime(),
                b.getEndTime())) {

            throw new RuntimeException("Cannot approve due to time conflict!");
        }

        b.setStatus(BookingStatus.APPROVED);
        return bookingRepository.save(b);
    }

    // ✅ Reject booking
    public Booking rejectBooking(Long id, String remark) {
        Booking b = getBookingById(id);
        b.setStatus(BookingStatus.REJECTED);
        b.setAdminRemark(remark);
        return bookingRepository.save(b);
    }

    // ✅ Cancel only own booking
    public Booking cancelBooking(Long id, String userId) {

        Booking b = getBookingById(id);

        if (!b.getUserId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own booking");
        }

        b.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(b);
    }

    // ✅ Delete booking
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    // ✅ Filter by status
    public List<Booking> getByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    // ✅ Filter by date
    public List<Booking> getByDate(LocalDate date) {
        return bookingRepository.findByDate(date);
    }

   
}