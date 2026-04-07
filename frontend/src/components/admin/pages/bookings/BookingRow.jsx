import { useState } from "react";
import {
  approveBooking,
} from "../../../../services/bookingService";
import RejectBookingModal from "./RejectBookingModal";
import { addNotification } from "../../../../services/notificationService";
import toast from "react-hot-toast";
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiClock as FiTime,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";

export default function BookingRow({ booking, refresh }) {
  const [openReject, setOpenReject] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const approve = async () => {
    if (!confirm(`Approve booking for ${booking.resourceId}?`)) return;
    
    setActionLoading(true);
    try {
      await approveBooking(booking.id);
      addNotification(`Booking ${booking.id} approved`);
      toast.success("Booking approved successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to approve booking");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (booking.status) {
      case "APPROVED":
        return {
          color: "text-green-400",
          bg: "bg-green-400/10",
          border: "border-green-400/20",
          icon: <FiCheckCircle className="w-4 h-4" />,
          label: "Approved"
        };
      case "REJECTED":
        return {
          color: "text-red-400",
          bg: "bg-red-400/10",
          border: "border-red-400/20",
          icon: <FiXCircle className="w-4 h-4" />,
          label: "Rejected"
        };
      default:
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-400/10",
          border: "border-yellow-400/20",
          icon: <FiClock className="w-4 h-4" />,
          label: "Pending"
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <>
      <tr className="group hover:bg-slate-800/30 transition-all duration-200 border-b border-slate-700/50">
        {/* Booking ID */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">#</span>
            <span className="text-slate-300 font-mono text-sm">
              {booking.id?.slice(-8) || 'N/A'}
            </span>
          </div>
        </td>

        {/* Resource ID */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">{booking.resourceId}</p>
              {booking.userId && (
                <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                  <FiUser className="w-3 h-3" />
                  {booking.userId}
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Date */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-green-400" />
            <span className="text-slate-300">{booking.date}</span>
          </div>
        </td>

        {/* Time */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <FiTime className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-300">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          {booking.status === "PENDING" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={approve}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </>
                )}
              </button>
              
              <button
                onClick={() => setOpenReject(true)}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiXCircle className="w-3.5 h-3.5" />
                Reject
              </button>

              {/* Details Toggle Button */}
              {(booking.purpose || booking.attendeeCount) && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 text-slate-400 hover:text-slate-300 transition-colors"
                  title={showDetails ? "Hide Details" : "View Details"}
                >
                  {showDetails ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${statusConfig.color}`}>
                {booking.status === "APPROVED" ? "✓ Booking Approved" : "✗ Booking Rejected"}
              </span>
              {booking.remark && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 text-slate-400 hover:text-slate-300 transition-colors"
                  title="View Rejection Reason"
                >
                  <FiAlertCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </td>
      </tr>

      {/* Expanded Details Row */}
      {showDetails && (
        <tr className="bg-slate-800/20">
          <td colSpan="6" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              {/* Purpose */}
              {booking.purpose && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Purpose
                  </div>
                  <p className="text-slate-300 text-sm">{booking.purpose}</p>
                </div>
              )}
              
              {/* Attendees */}
              {booking.attendeeCount && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Attendees
                  </div>
                  <p className="text-slate-300 text-sm">{booking.attendeeCount} people</p>
                </div>
              )}
              
              {/* User ID (if not shown already) */}
              {booking.userId && !booking.resourceId?.includes(booking.userId) && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <FiUser className="w-3.5 h-3.5" />
                    User ID
                  </div>
                  <p className="text-slate-300 text-sm">{booking.userId}</p>
                </div>
              )}

              {/* Created At */}
              {booking.createdAt && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <FiCalendar className="w-3.5 h-3.5" />
                    Created At
                  </div>
                  <p className="text-slate-300 text-sm">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              {/* Rejection Reason */}
              {booking.status === "REJECTED" && booking.remark && (
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium uppercase tracking-wider">
                    <FiAlertCircle className="w-3.5 h-3.5" />
                    Rejection Reason
                  </div>
                  <p className="text-red-300 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {booking.remark}
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* Reject Modal */}
      {openReject && (
        <RejectBookingModal
          bookingId={booking.id}
          onClose={() => setOpenReject(false)}
          refresh={refresh}
        />
      )}
    </>
  );
}