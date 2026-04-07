import { useEffect, useMemo, useState } from "react";
import { FiClipboard, FiClock, FiCheckCircle, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAssignedTickets } from "../../services/ticketService";

function StatCard({ title, value, icon, color, delay }) {
  return (
    <div
      className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-3 text-white shadow-md transition-all group-hover:scale-105">
          {icon}
        </div>
      </div>
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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="mt-2 text-orange-100">
            Monitor your assigned tickets, track SLA performance, and resolve issues efficiently.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Assigned Tickets"
          value={stats.total}
          icon={<FiClipboard size={22} />}
          color="text-orange-600"
          delay={0}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<FiClock size={22} />}
          color="text-blue-600"
          delay={80}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<FiCheckCircle size={22} />}
          color="text-emerald-600"
          delay={160}
        />
        <StatCard
          title="SLA Breaches"
          value={stats.breached}
          icon={<FiAlertTriangle size={22} />}
          color="text-red-600"
          delay={240}
        />
      </div>

      {/* Work Summary Card */}
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Work Summary</h2>
            <p className="mt-1 text-sm text-slate-500">
              You currently have <span className="font-semibold text-orange-600">{stats.total}</span> assigned tickets.
              {stats.breached > 0 && (
                <span className="ml-1 text-red-500">
                  ⚠️ {stats.breached} SLA breach{stats.breached > 1 ? "es" : ""} detected.
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/staff/tickets"}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
          >
            <FiTrendingUp size={16} />
            View All Tickets
          </button>
        </div>

        {/* Quick insight bar */}
        <div className="mt-5 flex flex-wrap gap-4 border-t border-orange-100 pt-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
            <span className="text-slate-600">In Progress: {stats.inProgress}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-slate-600">Resolved: {stats.resolved}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-slate-600">SLA Breaches: {stats.breached}</span>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeUp 0.5s ease both;
        }
        .grid > div {
          animation: fadeUp 0.5s ease both;
        }
      `}</style>
    </div>
  );
}