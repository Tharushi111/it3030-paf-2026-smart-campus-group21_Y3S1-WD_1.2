package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findByDateOrderByCreatedAtDesc(LocalDate date);

    List<Booking> findAllByOrderByCreatedAtDesc();

    // Prevent deleting resources that still have active bookings
    boolean existsByResourceIdAndStatusIn(Long resourceId, Collection<BookingStatus> statuses);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.date = :date
          AND b.status IN :statuses
          AND (:excludeId IS NULL OR b.id <> :excludeId)
          AND b.startTime < :endTime
          AND b.endTime > :startTime
    """)
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") Collection<BookingStatus> statuses,
            @Param("excludeId") Long excludeId
    );
}