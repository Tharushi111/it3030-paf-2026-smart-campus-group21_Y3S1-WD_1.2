import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiClock,
  FiMapPin,
  FiAlertTriangle,
  FiUser,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import { getAssignedTickets } from "../../../services/ticketService";
import UpdateTicketStatusModal from "../../admin/pages/tickets/UpdateTicketStatusModal";

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
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
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

function getStatusStyle(status) {
  switch (status) {
    case "OPEN":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "IN_PROGRESS":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    case "RESOLVED":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "CLOSED":
      return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    case "REJECTED":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
}

function formatRemainingTime(targetDate) {
  if (!targetDate) return "N/A";
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) return "Breached";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}

const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AssignedTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [editingTicket, setEditingTicket] = useState(null);

  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);
      const response = await getAssignedTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assigned tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    if (filter === "ALL") return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [tickets, filter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Assigned Tickets</h1>
          <p className="mt-1 text-sm text-zinc-500">
            View and update the tickets assigned to you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CustomDropdown
            value={filter}
            options={statusOptions}
            onChange={setFilter}
            placeholder="Filter by status"
          />
          <button
            onClick={fetchAssignedTickets}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center text-zinc-500">
          No assigned tickets found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                    ticket.status
                  )}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
                <span className="text-xs font-semibold text-orange-500">
                  {ticket.priority}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">{ticket.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{ticket.description}</p>

              <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <FiMapPin size={14} />
                  {ticket.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <FiUser size={14} />
                  Contact: {ticket.preferredContactName}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <FiClock size={14} />
                  First response:{" "}
                  {ticket.firstResponseBreached
                    ? "Breached"
                    : formatRemainingTime(ticket.firstResponseDueAt)}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <FiAlertTriangle size={14} />
                  Resolution:{" "}
                  {ticket.resolutionBreached
                    ? "Breached"
                    : formatRemainingTime(ticket.resolutionDueAt)}
                </div>
              </div>

              {ticket.imageUrls?.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {ticket.imageUrls.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:9090${img}`}
                      alt={`assigned-${index}`}
                      className="h-20 w-full rounded-lg border border-zinc-200 object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-5">
                <button
                  onClick={() => setEditingTicket(ticket)}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Update Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTicket && (
        <UpdateTicketStatusModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onUpdated={fetchAssignedTickets}
        />
      )}
    </div>
  );
}