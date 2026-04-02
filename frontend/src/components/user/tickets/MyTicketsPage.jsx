import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTag, FiClock, FiMapPin, FiRefreshCw } from "react-icons/fi";
import { getAllTickets, deleteTicket } from "../../../services/ticketService";
import CreateTicketForm from "./CreateTicketForm";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets();
      // Normally filter by logged-in user ID, but we just show all since no specific user auth exists yet
      setTickets(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
      const confirmed = window.confirm("Delete this ticket?");
      if (!confirmed) return;
      try {
        await deleteTicket(id);
        toast.success("Ticket deleted successfully.");
        fetchTickets();
      } catch (e) {
        toast.error("Error deleting ticket.");
      }
  };

  const filteredTickets = useMemo(() => {
    if (filter === "ALL") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "IN_PROGRESS": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "RESOLVED": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "CLOSED": return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
      case "REJECTED": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "CRITICAL": return "text-red-500 font-bold";
      case "HIGH": return "text-orange-500 font-semibold";
      case "MEDIUM": return "text-amber-500";
      case "LOW": return "text-emerald-500";
      default: return "text-zinc-500";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            My Tickets
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Track and manage your incident and maintenance reports</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTickets}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-zinc-400 transition hover:bg-slate-700 hover:text-white"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/40"
          >
            <FiPlus size={16} />
            New Ticket
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status 
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                : "bg-transparent text-zinc-400 hover:bg-slate-800"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
          <FiTag className="mb-4 text-zinc-600" size={32} />
          <h3 className="text-lg font-medium text-zinc-300">No tickets found</h3>
          <p className="mt-1 text-sm text-zinc-500">You haven't created any tickets yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
             <div 
               key={ticket.id}
               className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-900 via-blue-950/20 to-indigo-950/20 p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-orange-500/10"
             >
                <div>
                  <div className="mb-3 flex items-start justify-between">
                    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(ticket.status)}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span className={`text-xs ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{ticket.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{ticket.description}</p>
                </div>
                
                <div className="mt-5 space-y-2 border-t border-white/[0.05] pt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <FiMapPin className="text-orange-400/70" size={14} />
                    <span className="truncate">{ticket.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <FiClock className="text-orange-400/50" size={12} />
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => handleDelete(ticket.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 text-xs font-semibold">
                      Delete
                    </button>
                </div>
             </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTicketForm 
          onClose={() => setShowCreateModal(false)} 
          onCreated={fetchTickets}
        />
      )}
    </div>
  );
}
