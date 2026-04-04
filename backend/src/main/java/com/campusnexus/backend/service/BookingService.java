package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.campusnexus.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Conflict checking
    private boolean isConflict(Long resourceId,
                               java.time.LocalDate date,
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

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

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

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    // ✅ Filtering
    public List<Booking> getByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getByDate(java.time.LocalDate date) {
        return bookingRepository.findByDate(date);
    }
}