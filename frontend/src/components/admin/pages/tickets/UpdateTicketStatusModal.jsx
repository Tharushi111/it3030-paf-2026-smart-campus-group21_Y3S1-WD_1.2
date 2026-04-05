import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiSave, FiX, FiChevronDown } from "react-icons/fi";
import { updateTicketStatus } from "../../../../services/ticketService";

// Custom dropdown component
function CustomDropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-2.5 text-sm text-white outline-none transition-all hover:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 ${
          open ? "ring-2 ring-orange-500/20 border-orange-500/40" : ""
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`ml-2 text-orange-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-xl">
          <div className="max-h-56 overflow-y-auto custom-scroll">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm transition-all ${
                  option.value === value
                    ? "bg-orange-500/20 text-orange-300 font-semibold"
                    : "text-zinc-300 hover:bg-orange-500/10 hover:text-orange-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(251,146,60,0.4);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(251,146,60,0.6);
        }
      `}</style>
    </div>
  );
}

const statusOptions = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

export default function UpdateTicketStatusModal({
  ticket,
  onClose,
  onUpdated,
}) {
  const [status, setStatus] = useState(ticket.status || "OPEN");
  const [resolutionNotes, setResolutionNotes] = useState(
    ticket.resolutionNotes || ""
  );
  const [rejectionReason, setRejectionReason] = useState(
    ticket.rejectionReason || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStatus(ticket.status || "OPEN");
    setResolutionNotes(ticket.resolutionNotes || "");
    setRejectionReason(ticket.rejectionReason || "");
  }, [ticket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await updateTicketStatus(ticket.id, {
        status,
        resolutionNotes,
        rejectionReason,
      });

      toast.success("Ticket updated successfully");
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update ticket"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-500/20 bg-white/[0.02] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Update Status</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-orange-500/10 hover:text-orange-300"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">
                Ticket Status
              </label>
              <CustomDropdown
                value={status}
                options={statusOptions}
                onChange={setStatus}
                placeholder="Select status"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">
                Resolution Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                placeholder="Explain resolution details..."
                className="w-full resize-none rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              />
            </div>

            {status === "REJECTED" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why this ticket is rejected..."
                  className="w-full resize-none rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-orange-500/20 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-orange-500/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <FiSave size={16} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}