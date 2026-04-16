package com.campusnexus.backend.service;

import com.campusnexus.backend.dto.AdminDashboardResponse;
import com.campusnexus.backend.model.AppUser;
import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.campusnexus.backend.model.Resource;
import com.campusnexus.backend.model.Role;
import com.campusnexus.backend.model.Ticket;
import com.campusnexus.backend.repository.AppUserRepository;
import com.campusnexus.backend.repository.BookingRepository;
import com.campusnexus.backend.repository.ResourceRepository;
import com.campusnexus.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final AppUserRepository appUserRepository;

    public AdminDashboardResponse getDashboardData() {
        List<Resource> resources = resourceRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        List<Ticket> tickets = ticketRepository.findAll();
        List<AppUser> users = appUserRepository.findAll();

        Map<Long, Resource> resourceMap = resources.stream()
                .collect(Collectors.toMap(Resource::getId, Function.identity(), (a, b) -> a));

        long totalResources = resources.size();
        long activeResources = resources.stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();
        long outOfServiceResources = resources.stream()
                .filter(r -> "OUT_OF_SERVICE".equalsIgnoreCase(r.getStatus()))
                .count();

        long totalBookings = bookings.size();
        long pendingBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long approvedBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.APPROVED).count();
        long rejectedBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.REJECTED).count();
        long cancelledBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();

        long totalTickets = tickets.size();
        long openTickets = tickets.stream().filter(t -> "OPEN".equalsIgnoreCase(t.getStatus())).count();
        long inProgressTickets = tickets.stream().filter(t -> "IN_PROGRESS".equalsIgnoreCase(t.getStatus())).count();
        long resolvedTickets = tickets.stream().filter(t -> "RESOLVED".equalsIgnoreCase(t.getStatus())).count();
        long closedTickets = tickets.stream().filter(t -> "CLOSED".equalsIgnoreCase(t.getStatus())).count();
        long rejectedTicketsCount = tickets.stream().filter(t -> "REJECTED".equalsIgnoreCase(t.getStatus())).count();

        long totalUsers = users.size();
        long totalAdmins = users.stream().filter(u -> u.getRole() == Role.ADMIN).count();
        long totalStaff = users.stream().filter(u -> u.getRole() == Role.STAFF).count();
        long totalNormalUsers = users.stream().filter(u -> u.getRole() == Role.USER).count();
        long activeUsers = users.stream().filter(AppUser::isActive).count();

        // Only count meaningful booking activity for analytics
        List<Booking> analyticsBookings = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.APPROVED)
                .toList();

        List<AdminDashboardResponse.TopResourceItem> topResources = analyticsBookings.stream()
                .collect(Collectors.groupingBy(Booking::getResourceId, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> {
                    Resource resource = resourceMap.get(entry.getKey());
                    return AdminDashboardResponse.TopResourceItem.builder()
                            .resourceId(entry.getKey())
                            .resourceName(resource != null ? resource.getName() : "Unknown Resource")
                            .resourceType(resource != null ? resource.getType() : "N/A")
                            .location(resource != null ? resource.getLocation() : "N/A")
                            .bookingCount(entry.getValue())
                            .build();
                })
                .sorted(Comparator.comparingLong(AdminDashboardResponse.TopResourceItem::getBookingCount).reversed())
                .limit(6)
                .toList();

        List<AdminDashboardResponse.PeakBookingHourItem> peakBookingHours = analyticsBookings.stream()
                .filter(b -> b.getStartTime() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getStartTime().getHour(),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> AdminDashboardResponse.PeakBookingHourItem.builder()
                        .hourLabel(formatHourRangeAmPm(entry.getKey()))
                        .bookingCount(entry.getValue())
                        .build())
                .sorted(Comparator.comparingLong(AdminDashboardResponse.PeakBookingHourItem::getBookingCount).reversed())
                .limit(6)
                .toList();

        List<AdminDashboardResponse.ResourceTypeUsageItem> resourceTypeUsage = analyticsBookings.stream()
                .map(b -> resourceMap.get(b.getResourceId()))
                .filter(resource -> resource != null && resource.getType() != null)
                .collect(Collectors.groupingBy(Resource::getType, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> AdminDashboardResponse.ResourceTypeUsageItem.builder()
                        .type(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .sorted(Comparator.comparingLong(AdminDashboardResponse.ResourceTypeUsageItem::getCount).reversed())
                .toList();

        List<AdminDashboardResponse.TicketPriorityItem> ticketPriorityDistribution = tickets.stream()
                .filter(ticket -> ticket.getPriority() != null && !ticket.getPriority().isBlank())
                .collect(Collectors.groupingBy(Ticket::getPriority, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> AdminDashboardResponse.TicketPriorityItem.builder()
                        .priority(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .sorted((a, b) -> Integer.compare(priorityOrder(a.getPriority()), priorityOrder(b.getPriority())))
                .toList();

        return AdminDashboardResponse.builder()
                .totalResources(totalResources)
                .activeResources(activeResources)
                .outOfServiceResources(outOfServiceResources)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .approvedBookings(approvedBookings)
                .rejectedBookings(rejectedBookings)
                .cancelledBookings(cancelledBookings)
                .totalTickets(totalTickets)
                .openTickets(openTickets)
                .inProgressTickets(inProgressTickets)
                .resolvedTickets(resolvedTickets)
                .closedTickets(closedTickets)
                .rejectedTicketsCount(rejectedTicketsCount)
                .totalUsers(totalUsers)
                .totalAdmins(totalAdmins)
                .totalStaff(totalStaff)
                .totalNormalUsers(totalNormalUsers)
                .activeUsers(activeUsers)
                .topResources(topResources)
                .peakBookingHours(peakBookingHours)
                .resourceTypeUsage(resourceTypeUsage)
                .ticketPriorityDistribution(ticketPriorityDistribution)
                .build();
    }

    private String formatHourRangeAmPm(int hour) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");
        LocalTime start = LocalTime.of(hour, 0);
        LocalTime end = start.plusHours(1);
        return start.format(formatter) + " - " + end.format(formatter);
    }

    private int priorityOrder(String priority) {
        if (priority == null) return 999;
        return switch (priority.toUpperCase()) {
            case "CRITICAL" -> 1;
            case "HIGH" -> 2;
            case "MEDIUM" -> 3;
            case "LOW" -> 4;
            default -> 999;
        };
    }
}