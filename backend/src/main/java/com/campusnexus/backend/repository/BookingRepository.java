package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByResourceIdAndDate(Long resourceId, LocalDate date);

    List<Booking> findByUserId(String userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByDate(LocalDate date);
}