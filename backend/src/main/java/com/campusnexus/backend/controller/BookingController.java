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

    @PostMapping
    public ResponseEntity<Booking> create(@Valid @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Booking> approve(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable Long id,
                                          @RequestParam String remark) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, remark));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable Long id,
                                          @RequestParam String userId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    // ✅ Filtering endpoints
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