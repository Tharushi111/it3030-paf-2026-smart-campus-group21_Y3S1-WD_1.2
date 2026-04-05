import { useEffect, useMemo, useState } from "react";
import { FiClipboard, FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAssignedTickets } from "../../services/ticketService";

function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 shadow-lg">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
        {icon}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-300">{title}</p>
    </div>
  );
}

export default function StaffDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const fetchAssignedTickets = async () => {
    try {
      const response = await getAssignedTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assigned tickets");
    }
  };

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      breached: tickets.filter(
        (t) => t.firstResponseBreached || t.resolutionBreached
      ).length,
    };
  }, [tickets]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Monitor your assigned tickets and service response performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Assigned Tickets"
          value={stats.total}
          icon={<FiClipboard />}
          color="text-white"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<FiClock />}
          color="text-orange-500"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<FiCheckCircle />}
          color="text-emerald-500"
        />
        <StatCard
          title="SLA Breaches"
          value={stats.breached}
          icon={<FiAlertTriangle />}
          color="text-red-500"
        />
      </div>

      <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Work Summary</h2>
        <p className="mt-2 text-sm text-zinc-500">
          You currently have {stats.total} assigned tickets. Keep an eye on
          service-level timer breaches and resolve tickets promptly.
        </p>
      </div>
    </div>
  );
}