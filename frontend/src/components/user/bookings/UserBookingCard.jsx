import { FiMapPin, FiCalendar, FiClock, FiUsers, FiXCircle } from "react-icons/fi";

function formatTime(t) {
  if (t == null) return "—";
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function statusClasses(status) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "REJECTED":
      return "bg-red-100 text-red-700 border border-red-200";
    case "CANCELLED":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

export default function UserBookingCard({ booking, resource, onCancel, canCancel }) {
  const title = resource?.name || `Resource #${booking.resourceId}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
      <div className="relative h-44 w-full flex-shrink-0 overflow-hidden bg-orange-50">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-400 to-orange-400 opacity-90" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          Booking
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-lg font-bold leading-tight line-clamp-2 drop-shadow-sm">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(booking.status)}`}
          >
            {booking.status?.replaceAll("_", " ")}
          </span>
          {booking.attendeeCount != null && (
            <span className="flex items-center gap-1 text-sm text-slate-600">
              <FiUsers className="text-orange-500" size={14} />
              {booking.attendeeCount}
            </span>
          )}
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-slate-600">
          {booking.purpose || "—"}
        </p>

        <div className="space-y-2 text-sm text-slate-600">
          {resource?.location && (
            <div className="flex items-center gap-2">
              <FiMapPin className="text-orange-500" size={14} />
              <span>{resource.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FiCalendar className="text-orange-500" size={14} />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-orange-500" size={14} />
            <span>
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </span>
          </div>
        </div>

        {booking.status === "REJECTED" && booking.adminRemark && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-800">
            {booking.adminRemark}
          </div>
        )}

        {canCancel && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <FiXCircle size={14} />
              Cancel booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
