import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";

import {
  FiPlus,
  FiTag,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { getMyTickets, deleteTicket } from "../../../services/ticketService";
import CreateTicketForm from "./CreateTicketForm";
import TicketDetailsModal from "./TicketDetailsModal";
import EditTicketModal from "./EditTicketModal";

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

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchTickets = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await getMyTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error(error);

      if (showLoader) {
        toast.error("Failed to load tickets");
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchTickets(true);

    const interval = setInterval(() => {
      fetchTickets(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchTickets]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this ticket?");
    if (!confirmed) return;

    try {
      await deleteTicket(id);
      toast.success("Ticket deleted successfully.");
      fetchTickets(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error deleting ticket.");
    }
  };

  const filteredTickets = useMemo(() => {
    if (filter === "ALL") return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [tickets, filter]);

  const canUserModifyTicket = (ticket) => {
    return !ticket.assignedStaff && (ticket.status === "OPEN" || ticket.status === "REJECTED");
  };

  return (
    <div
      className="mx-auto max-w-7xl space-y-8 p-4 md:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1
            className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-3xl font-bold text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            My Tickets
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage your maintenance and incident reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-orange-500/30"
          >
            <FiPlus size={16} />
            New Ticket
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? "border border-orange-300 bg-orange-100 text-orange-700 shadow-sm"
                  : "border border-transparent bg-white text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-orange-200 bg-white/80 py-20 text-center shadow-sm">
          <FiTag className="mb-4 text-orange-300" size={34} />
          <h3 className="text-lg font-semibold text-slate-700">
            No tickets found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            You haven't created any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((ticket) => {
            const canModify = canUserModifyTicket(ticket);

            return (
              <div
                key={ticket.id}
                className="flex h-full min-h-[320px] flex-col rounded-[28px] border border-orange-200 bg-gradient-to-br from-white via-orange-50/50 to-amber-50/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/60"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    {(ticket.status || "UNKNOWN").replace("_", " ")}
                  </span>

                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority} Priority
                  </span>
                </div>

                <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold text-slate-800">
                  {ticket.title}
                </h3>

                <p className="mt-2 line-clamp-4 min-h-[96px] text-sm leading-6 text-slate-500">
                  {ticket.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <p>
                    <span className="font-semibold text-slate-700">Category:</span>{" "}
                    {ticket.category || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Location:</span>{" "}
                    {ticket.location || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Assigned Staff:</span>{" "}
                    {ticket.assignedStaff?.fullName || ticket.assignedStaff?.name || "Not Assigned"}
                  </p>
                </div>

                <div className="mt-auto pt-5">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <FiEye size={14} />
                      View
                    </button>

                    {canModify ? (
                      <>
                        <button
                          onClick={() => setEditingTicket(ticket)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          <FiEdit2 size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-medium text-slate-400">
                          Edit
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-medium text-slate-400">
                          Delete
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateTicketForm
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchTickets(false)}
        />
      )}

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onUpdated={() => fetchTickets(false)}
        />
      )}
    </div>
  );
}