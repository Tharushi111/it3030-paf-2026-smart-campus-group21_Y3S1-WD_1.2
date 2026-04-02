import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiTag, FiSearch, FiEdit2, FiTrash2, FiClock, FiMapPin, FiLayers, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { getAllTickets, deleteTicket } from "../../../../services/ticketService";
import UpdateTicketStatusModal from "./UpdateTicketStatusModal";

function StatCard({ title, value, subtitle, icon, gradient, border }) {
  return (
    <div className={`rounded-2xl border ${border} p-5 shadow-xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 transition-all hover:-translate-y-[2px]`}>
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-300">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

export default function AdminTicketManagementPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingTicket, setEditingTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets();
      setTickets(response.data || []);
    } catch (error) {
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
      toast.success("Ticket deleted");
      fetchTickets();
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        ticket.location?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        ticket.category?.toLowerCase().startsWith(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, statusFilter]);

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN": return <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>Open</span>;
      case "IN_PROGRESS": return <span className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-300"><span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>In Progress</span>;
      case "RESOLVED": return <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Resolved</span>;
      case "CLOSED": return <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-500/30 bg-zinc-500/15 px-2.5 py-1 text-xs font-semibold text-zinc-300"><span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>Closed</span>;
      case "REJECTED": return <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <section className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              <FiLayers size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Ticketing Module
            </span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl font-bold text-white">
            Ticket Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review and resolve maintenance & Incident tickets.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tickets"
          value={tickets.length}
          subtitle="All reported issues"
          icon={<FiTag />}
          gradient="from-slate-500 to-zinc-400"
          border="border-zinc-500/20"
        />
        <StatCard
          title="Open Tickets"
          value={openCount}
          subtitle="Awaiting action"
          icon={<FiAlertCircle />}
          gradient="from-rose-500 to-pink-400"
          border="border-rose-500/20"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Currently working"
          icon={<FiClock />}
          gradient="from-orange-500 to-amber-400"
          border="border-orange-500/20"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Fixed issues"
          icon={<FiCheckCircle />}
          gradient="from-emerald-500 to-teal-400"
          border="border-emerald-500/20"
        />
      </section>

      {/* Filter Bar */}
      <section className="relative z-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 py-4 shadow-md">
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <div className="relative w-full flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={14} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-orange-500/30 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex w-full gap-3 md:w-auto">
             <select 
               value={statusFilter} 
               onChange={(e) => setStatusFilter(e.target.value)}
               className="w-full rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
             >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
             </select>
          </div>
        </div>
      </section>

      {/* Ticket Table */}
      <section className="table-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {loading ? (
             <div className="px-6 py-16 text-center">
               <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
               <p className="text-sm text-zinc-500">Loading tickets...</p>
             </div>
           ) : filteredTickets.length === 0 ? (
             <div className="px-6 py-16 text-center">
                <FiTag size={32} className="mx-auto mb-3 text-zinc-700" />
                <p className="font-semibold text-zinc-400">No tickets found</p>
             </div>
           ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-orange-500/20 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">Ticket Details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-orange-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-white/[0.05] transition-all hover:bg-orange-500/5">
                        <td className="px-6 py-4">
                           <div className="font-medium text-white">{ticket.title}</div>
                           <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                             <FiMapPin size={12}/> {ticket.location}
                           </div>
                           <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                             <FiClock size={12}/> {new Date(ticket.createdAt).toLocaleString()}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                             <span className="inline-flex items-center rounded-lg border border-purple-500/30 bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-300">
                               {ticket.category}
                             </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`text-xs font-bold ${
                              ticket.priority === 'CRITICAL' ? 'text-red-500' :
                              ticket.priority === 'HIGH' ? 'text-orange-500' :
                              ticket.priority === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                                {ticket.priority}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {getStatusBadge(ticket.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditingTicket(ticket)}
                                    className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2 text-orange-400 transition hover:bg-orange-500/20"
                                    title="Edit Status"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(ticket.id)}
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                                    title="Delete"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                  ))}
              </tbody>
            </table>
           )}
      </section>

      {editingTicket && (
        <UpdateTicketStatusModal
           ticket={editingTicket}
           onClose={() => setEditingTicket(null)}
           onUpdated={fetchTickets}
        />
      )}
    </div>
  );
}
