package com.campusnexus.backend.controller;

import com.campusnexus.backend.dto.BookingDecisionRequest;
import com.campusnexus.backend.dto.BookingRequest;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.service.BookingQrService;
import com.campusnexus.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BookingQrService bookingQrService;
    private final AppUserRepository appUserRepository;

    public BookingController(BookingService bookingService,
                             BookingQrService bookingQrService,
                             AppUserRepository appUserRepository) {
        this.bookingService = bookingService;
        this.bookingQrService = bookingQrService;
        this.appUserRepository = appUserRepository;
    }

    @PostMapping("/resource/{resourceId}")
    public ResponseEntity<Booking> create(@PathVariable Long resourceId,
                                          @Valid @RequestBody BookingRequest request,
                                          @AuthenticationPrincipal OidcUser oidcUser) {
        return ResponseEntity.ok(
                bookingService.createBooking(resourceId, request, oidcUser.getEmail())
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal OidcUser oidcUser) {
        return ResponseEntity.ok(
                bookingService.getMyBookings(oidcUser.getEmail())
        );
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAll(@AuthenticationPrincipal OidcUser oidcUser) {
        AppUser user = getCurrentUser(oidcUser);

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.ok(bookingService.getAllBookings());
        }

        return ResponseEntity.ok(bookingService.getMyBookings(user.getEmail()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id,
                                           @AuthenticationPrincipal OidcUser oidcUser) {
        AppUser user = getCurrentUser(oidcUser);
        return ResponseEntity.ok(
                bookingService.getBookingForViewer(id, user.getEmail(), user.getRole())
        );
    }

    @PutMapping("/{id}/resource/{resourceId}")
    public ResponseEntity<Booking> update(@PathVariable Long id,
                                          @PathVariable Long resourceId,
                                          @Valid @RequestBody BookingRequest request,
                                          @AuthenticationPrincipal OidcUser oidcUser) {
        AppUser user = getCurrentUser(oidcUser);
        return ResponseEntity.ok(
                bookingService.updateBooking(id, resourceId, request, user.getEmail(), user.getRole())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id,
                                         @AuthenticationPrincipal OidcUser oidcUser) {
        AppUser user = getCurrentUser(oidcUser);
        bookingService.deleteBooking(id, user.getEmail(), user.getRole());
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Booking> approve(@PathVariable Long id,
                                           @RequestBody(required = false) BookingDecisionRequest request) {
        return ResponseEntity.ok(bookingService.approveBooking(id, request));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable Long id,
                                          @Valid @RequestBody BookingDecisionRequest request) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable Long id,
                                          @AuthenticationPrincipal OidcUser oidcUser) {
        AppUser user = getCurrentUser(oidcUser);
        return ResponseEntity.ok(
                bookingService.cancelBooking(id, user.getEmail(), user.getRole())
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getByStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getByStatus(status));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Booking>> getByDate(@PathVariable String date) {
        return ResponseEntity.ok(bookingService.getByDate(LocalDate.parse(date)));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getApprovedBookingQr(@PathVariable Long id,
                                                       @AuthenticationPrincipal OidcUser oidcUser) {
        AppUser user = getCurrentUser(oidcUser);
        Booking booking = bookingService.getBookingForViewer(id, user.getEmail(), user.getRole());

        byte[] qrBytes = bookingQrService.generateApprovedBookingQr(booking);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=booking-" + id + "-qr.png")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrBytes);
    }

    private AppUser getCurrentUser(OidcUser oidcUser) {
        return appUserRepository.findByEmail(oidcUser.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}