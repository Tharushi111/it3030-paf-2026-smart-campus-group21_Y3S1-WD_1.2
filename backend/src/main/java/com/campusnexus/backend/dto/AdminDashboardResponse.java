package com.campusnexus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    // Resource stats
    private long totalResources;
    private long activeResources;
    private long outOfServiceResources;

    // Booking stats
    private long totalBookings;
    private long pendingBookings;
    private long approvedBookings;
    private long rejectedBookings;
    private long cancelledBookings;

    // Ticket stats
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;
    private long rejectedTicketsCount;

    // User stats
    private long totalUsers;
    private long totalAdmins;
    private long totalStaff;
    private long totalNormalUsers;
    private long activeUsers;

    // Analytics
    private List<TopResourceItem> topResources;
    private List<PeakBookingHourItem> peakBookingHours;
    private List<ResourceTypeUsageItem> resourceTypeUsage;
    private List<TicketPriorityItem> ticketPriorityDistribution;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopResourceItem {
        private Long resourceId;
        private String resourceName;
        private String resourceType;
        private String location;
        private long bookingCount;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeakBookingHourItem {
        private String hourLabel;
        private long bookingCount;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceTypeUsageItem {
        private String type;
        private long count;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketPriorityItem {
        private String priority;
        private long count;
    }
}