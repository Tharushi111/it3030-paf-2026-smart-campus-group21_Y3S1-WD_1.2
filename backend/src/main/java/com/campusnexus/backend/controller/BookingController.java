package com.campusnexus.backend.controller;

import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.campusnexus.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<Booking> create(@Valid @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ Get bookings of a specific user, newest first
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getByUser(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getBookingsByUserSorted(userId);
        return ResponseEntity.ok(bookings);
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    // Update booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> update(@PathVariable Long id,
                                          @Valid @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.updateBooking(id, booking));
    }

    // Approve booking
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Booking> approve(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    // Reject booking
    @PatchMapping("/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable Long id,
                                          @RequestParam String remark) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, remark));
    }

    // Cancel booking
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable Long id,
                                          @RequestParam String userId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    // Filtering endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getByStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getByStatus(status));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Booking>> getByDate(@PathVariable String date) {
        return ResponseEntity.ok(
                bookingService.getByDate(java.time.LocalDate.parse(date))
        );
    }
}