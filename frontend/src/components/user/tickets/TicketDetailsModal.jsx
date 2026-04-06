import {
    FiX,
    FiMapPin,
    FiClock,
    FiUser,
    FiImage,
    FiMail,
    FiPhone,
    FiAlertTriangle,
  } from "react-icons/fi";
  
  function getStatusStyle(status) {
    switch (status) {
      case "OPEN":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "IN_PROGRESS":
        return "border-orange-200 bg-orange-50 text-orange-700";
      case "RESOLVED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "CLOSED":
        return "border-zinc-200 bg-zinc-100 text-zinc-700";
      case "REJECTED":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-slate-200 bg-slate-100 text-slate-600";
    }
  }
  
  function getPriorityStyle(priority) {
    switch (priority) {
      case "CRITICAL":
        return "border-red-200 bg-red-50 text-red-600";
      case "HIGH":
        return "border-orange-200 bg-orange-50 text-orange-600";
      case "MEDIUM":
        return "border-amber-200 bg-amber-50 text-amber-600";
      case "LOW":
        return "border-emerald-200 bg-emerald-50 text-emerald-600";
      default:
        return "border-zinc-200 bg-zinc-50 text-zinc-600";
    }
  }
  
  function formatRemainingTime(targetDate) {
    if (!targetDate) return "N/A";
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return "Breached";
  
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours <= 0 ? `${minutes}m remaining` : `${hours}h ${minutes}m remaining`;
  }
  
  export default function TicketDetailsModal({ ticket, onClose }) {
    if (!ticket) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        />
  
        <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-orange-200 bg-gradient-to-br from-white via-orange-50 to-amber-50 shadow-2xl">
          <div className="flex items-center justify-between border-b border-orange-200 bg-white/90 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Ticket Details</h2>
              <p className="text-sm text-slate-500">Full ticket information and evidence</p>
            </div>
  
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-500 transition hover:bg-orange-100 hover:text-orange-500"
            >
              <FiX size={22} />
            </button>
          </div>
  
          <div className="overflow-y-auto px-6 py-6">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(ticket.status)}`}>
                {(ticket.status || "UNKNOWN").replace("_", " ")}
              </span>
  
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(ticket.priority)}`}>
                {ticket.priority} Priority
              </span>
            </div>
  
            <h3 className="text-2xl font-bold text-slate-800">{ticket.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{ticket.description}</p>
  
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-orange-600">
                  Ticket Information
                </h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-orange-500" />
                    <span>{ticket.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-orange-500" />
                    <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "No date available"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUser className="text-orange-500" />
                    <span>
                      Assigned Staff: {ticket.assignedStaff?.fullName || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="text-orange-500" />
                    <span>Category: {ticket.category}</span>
                  </div>
                </div>
              </div>
  
              <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-orange-600">
                  Contact Details
                </h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-orange-500" />
                    <span>{ticket.preferredContactName || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-orange-500" />
                    <span>{ticket.preferredContactEmail || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-orange-500" />
                    <span>{ticket.preferredContactPhone || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="mt-6 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-700">
                <FiAlertTriangle size={15} />
                Service-Level Timer
              </div>
  
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
                  <p className="text-slate-500">First response</p>
                  <p className={`mt-1 font-semibold ${ticket.firstResponseBreached ? "text-red-500" : "text-slate-700"}`}>
                    {ticket.firstResponseBreached
                      ? "Breached"
                      : formatRemainingTime(ticket.firstResponseDueAt)}
                  </p>
                </div>
  
                <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
                  <p className="text-slate-500">Resolution</p>
                  <p className={`mt-1 font-semibold ${ticket.resolutionBreached ? "text-red-500" : "text-slate-700"}`}>
                    {ticket.resolutionBreached
                      ? "Breached"
                      : formatRemainingTime(ticket.resolutionDueAt)}
                  </p>
                </div>
              </div>
            </div>
  
            {ticket.resolutionNotes && (
              <div className="mt-6 rounded-2xl border border-orange-200 bg-white p-4 shadow-sm">
                <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-600">
                  Resolution Notes
                </h4>
                <p className="text-sm leading-7 text-slate-600">{ticket.resolutionNotes}</p>
              </div>
            )}
  
            {ticket.rejectionReason && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-red-600">
                  Rejection Reason
                </h4>
                <p className="text-sm leading-7 text-red-700">{ticket.rejectionReason}</p>
              </div>
            )}
  
            {ticket.imageUrls?.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiImage className="text-orange-500" />
                  Evidence Images
                </div>
  
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {ticket.imageUrls.map((img, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm"
                    >
                      <img
                        src={`http://localhost:9090${img}`}
                        alt={`ticket-${index}`}
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }