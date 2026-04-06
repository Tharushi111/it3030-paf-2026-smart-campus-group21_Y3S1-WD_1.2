import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiImage
} from "react-icons/fi";
import { getBookingQr } from "../../../services/bookingService";
import toast from "react-hot-toast";

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

export default function UserBookingCard({
  booking,
  resource,
  onCancel,
  onEdit,
  onDelete,
}) {

  const title = resource?.name || `Resource #${booking.resourceId}`;

  const imageUrl = resource?.imageUrl
    ? `http://localhost:9090${resource.imageUrl}`
    : null;

  const handleDownloadQr = async () => {
    try {
      const response = await getBookingQr(booking.id);

      const blob = new Blob([response.data], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `booking-${booking.id}-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("QR code downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download QR code");
    }
  };

  const canManage = booking.status === "PENDING";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">

      {/* IMAGE SECTION */}
      <div className="relative h-44 w-full overflow-hidden flex-shrink-0 bg-orange-50">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-orange-300">
            <FiImage size={30} />
          </div>
        )}

        {/* Booking tag - orange gradient */}
        <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1 text-xs font-bold text-white shadow-md">
          Booking
        </div>

        {/* Dark gradient overlay for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-8 pb-3 px-5">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md">
            {title}
          </h3>
        </div>

      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">

        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
              booking.status
            )}`}
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

        {/* Admin Remark – corrected JSX */}
        {booking.status === "REJECTED" && booking.adminRemark && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-800">
            <span className="font-semibold">Admin remark:</span> {booking.adminRemark}
          </div>
        )}

        {/* QR Download */}
        {booking.status === "APPROVED" && (
          <button
            type="button"
            onClick={handleDownloadQr}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <FiDownload size={14} />
            Download QR
          </button>
        )}

        {/* ACTION BUTTONS */}
        {canManage && (
          <div className="mt-4 flex gap-2">

            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <FiXCircle size={14} />
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onEdit(booking)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <FiEdit size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(booking.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <FiTrash2 size={14} />
              Delete
            </button>

          </div>
        )}

      </div>
    </div>
  );
}