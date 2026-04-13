import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiLayers,
  FiRefreshCw,
  FiTool,
  FiTrendingUp,
  FiUsers,
  FiXCircle,
  FiShield,
  FiBarChart2,
} from "react-icons/fi";
import { getAdminDashboardData } from "../../services/adminDashboardService";

function StatCard({ title, value, subtitle, icon, gradient, border }) {
  return (
    <div
      className={`rounded-2xl border ${border} bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 shadow-xl transition-all hover:-translate-y-[2px]`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-300">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

function MiniBarChart({
  items,
  colorClass = "bg-orange-400",
  labelKey = "resourceName",
  valueKey = "bookingCount",
  subLabelBuilder,
}) {
  const max = Math.max(...items.map((item) => item[valueKey] || 0), 1);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const value = item[valueKey] || 0;
        const width = `${(value / max) * 100}%`;

        return (
          <div key={index}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium text-zinc-200">
                {item[labelKey]}
              </p>
              <span className="text-xs font-semibold text-orange-300">
                {value}
              </span>
            </div>

            {subLabelBuilder && (
              <p className="mb-2 truncate text-xs text-zinc-500">
                {subLabelBuilder(item)}
              </p>
            )}

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${colorClass}`}
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold";

  switch (status) {
    case "PENDING":
    case "OPEN":
      return (
        <span className={`${base} border-amber-500/20 bg-amber-500/10 text-amber-300`}>
          {status}
        </span>
      );
    case "APPROVED":
    case "RESOLVED":
      return (
        <span className={`${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-300`}>
          {status}
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className={`${base} border-orange-500/20 bg-orange-500/10 text-orange-300`}>
          {status}
        </span>
      );
    case "REJECTED":
    case "CANCELLED":
    case "CLOSED":
      return (
        <span className={`${base} border-red-500/20 bg-red-500/10 text-red-300`}>
          {status}
        </span>
      );
    default:
      return (
        <span className={`${base} border-zinc-500/20 bg-zinc-500/10 text-zinc-300`}>
          {status}
        </span>
      );
  }
}

function formatLastUpdated(date) {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function OverviewRow({ icon, label, value, color, percent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-zinc-200">{label}</span>
        </div>
        <span className="text-xl font-bold text-white">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/70"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function OverviewCard({ title, icon, accent, totalLabel, totalValue, rows }) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-zinc-500">{totalLabel}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-white">{totalValue}</p>
          <p className="text-xs uppercase tracking-wider text-zinc-500">Total</p>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <OverviewRow
            key={index}
            icon={row.icon}
            label={row.label}
            value={row.value}
            color={row.color}
            percent={(row.value / max) * 100}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = async (showToast = false, silent = false) => {
    try {
      if (!data && !silent) {
        setLoading(true);
      } else if (!silent) {
        setRefreshing(true);
      }

      const response = await getAdminDashboardData();
      setData(response.data);
      setLastUpdated(new Date());

      if (showToast) {
        toast.success("Dashboard refreshed");
      }
    } catch (error) {
      console.error(error);
      if (!silent) {
        toast.error("Failed to load dashboard");
      }
    } finally {
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboard(false, false);

    const interval = setInterval(() => {
      fetchDashboard(false, true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const topResources = useMemo(() => data?.topResources || [], [data]);
  const peakBookingHours = useMemo(() => data?.peakBookingHours || [], [data]);
  const resourceTypeUsage = useMemo(() => data?.resourceTypeUsage || [], [data]);
  const ticketPriorityDistribution = useMemo(
    () => data?.ticketPriorityDistribution || [],
    [data]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              <FiGrid size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Admin Overview
            </span>
          </div>

          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Real-time campus operations summary with analytics and activity.
          </p>

          <p className="mt-2 text-xs text-zinc-500">
            Last updated:{" "}
            <span className="font-semibold text-orange-300">
              {formatLastUpdated(lastUpdated)}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard(true, false)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-3 text-sm font-semibold text-orange-300 shadow-lg transition-all hover:border-orange-400 hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Resources"
          value={data?.totalResources || 0}
          subtitle={`${data?.activeResources || 0} active resources`}
          icon={<FiLayers />}
          gradient="from-orange-500 to-amber-400"
          border="border-orange-500/20"
        />
        <StatCard
          title="Total Bookings"
          value={data?.totalBookings || 0}
          subtitle={`${data?.approvedBookings || 0} approved bookings`}
          icon={<FiCalendar />}
          gradient="from-emerald-500 to-teal-400"
          border="border-emerald-500/20"
        />
        <StatCard
          title="Total Tickets"
          value={data?.totalTickets || 0}
          subtitle={`${data?.openTickets || 0} open tickets`}
          icon={<FiTool />}
          gradient="from-violet-500 to-purple-400"
          border="border-violet-500/20"
        />
        <StatCard
          title="Total Users"
          value={data?.totalUsers || 0}
          subtitle={`${data?.activeUsers || 0} active users`}
          icon={<FiUsers />}
          gradient="from-sky-500 to-cyan-400"
          border="border-sky-500/20"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <OverviewCard
          title="Booking Overview"
          icon={<FiCalendar className="text-white" size={22} />}
          accent="bg-gradient-to-br from-orange-500 to-amber-400"
          totalLabel="All booking activity"
          totalValue={data?.totalBookings || 0}
          rows={[
            {
              label: "Pending",
              value: data?.pendingBookings || 0,
              icon: <FiClock className="text-amber-300" size={18} />,
              color: "bg-amber-500/15 border border-amber-500/20 text-amber-300",
            },
            {
              label: "Approved",
              value: data?.approvedBookings || 0,
              icon: <FiCheckCircle className="text-emerald-300" size={18} />,
              color: "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
            },
            {
              label: "Rejected",
              value: data?.rejectedBookings || 0,
              icon: <FiXCircle className="text-red-300" size={18} />,
              color: "bg-red-500/15 border border-red-500/20 text-red-300",
            },
            {
              label: "Cancelled",
              value: data?.cancelledBookings || 0,
              icon: <FiAlertCircle className="text-zinc-300" size={18} />,
              color: "bg-zinc-500/15 border border-zinc-500/20 text-zinc-300",
            },
          ]}
        />

        <OverviewCard
          title="Ticket Overview"
          icon={<FiTool className="text-white" size={22} />}
          accent="bg-gradient-to-br from-violet-500 to-purple-400"
          totalLabel="All ticket activity"
          totalValue={data?.totalTickets || 0}
          rows={[
            {
              label: "Open",
              value: data?.openTickets || 0,
              icon: <FiAlertCircle className="text-amber-300" size={18} />,
              color: "bg-amber-500/15 border border-amber-500/20 text-amber-300",
            },
            {
              label: "In Progress",
              value: data?.inProgressTickets || 0,
              icon: <FiActivity className="text-orange-300" size={18} />,
              color: "bg-orange-500/15 border border-orange-500/20 text-orange-300",
            },
            {
              label: "Resolved",
              value: data?.resolvedTickets || 0,
              icon: <FiCheckCircle className="text-emerald-300" size={18} />,
              color: "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
            },
            {
              label: "Closed",
              value: data?.closedTickets || 0,
              icon: <FiXCircle className="text-zinc-300" size={18} />,
              color: "bg-zinc-500/15 border border-zinc-500/20 text-zinc-300",
            },
          ]}
        />

        <OverviewCard
          title="User Overview"
          icon={<FiUsers className="text-white" size={22} />}
          accent="bg-gradient-to-br from-sky-500 to-cyan-400"
          totalLabel="All registered users"
          totalValue={data?.totalUsers || 0}
          rows={[
            {
              label: "Admins",
              value: data?.totalAdmins || 0,
              icon: <FiShield className="text-red-300" size={18} />,
              color: "bg-red-500/15 border border-red-500/20 text-red-300",
            },
            {
              label: "Staff",
              value: data?.totalStaff || 0,
              icon: <FiUsers className="text-sky-300" size={18} />,
              color: "bg-sky-500/15 border border-sky-500/20 text-sky-300",
            },
            {
              label: "Users",
              value: data?.totalNormalUsers || 0,
              icon: <FiUsers className="text-emerald-300" size={18} />,
              color: "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
            },
            {
              label: "Active",
              value: data?.activeUsers || 0,
              icon: <FiTrendingUp className="text-orange-300" size={18} />,
              color: "bg-orange-500/15 border border-orange-500/20 text-orange-300",
            },
          ]}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-2">
            <FiTrendingUp className="text-orange-400" />
            <h2 className="text-lg font-bold text-white">Top Resources</h2>
          </div>

          {topResources.length === 0 ? (
            <p className="text-sm text-zinc-500">No booking analytics available yet.</p>
          ) : (
            <MiniBarChart
              items={topResources}
              colorClass="bg-orange-400"
              labelKey="resourceName"
              valueKey="bookingCount"
              subLabelBuilder={(item) => `${item.resourceType} • ${item.location}`}
            />
          )}
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-2">
            <FiClock className="text-sky-400" />
            <h2 className="text-lg font-bold text-white">Peak Booking Hours</h2>
          </div>

          {peakBookingHours.length === 0 ? (
            <p className="text-sm text-zinc-500">No peak-hour analytics available yet.</p>
          ) : (
            <MiniBarChart
              items={peakBookingHours}
              colorClass="bg-sky-400"
              labelKey="hourLabel"
              valueKey="bookingCount"
            />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-2">
            <FiLayers className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Resource Usage by Type</h2>
          </div>

          {resourceTypeUsage.length === 0 ? (
            <p className="text-sm text-zinc-500">No resource usage analytics available yet.</p>
          ) : (
            <MiniBarChart
              items={resourceTypeUsage}
              colorClass="bg-emerald-400"
              labelKey="type"
              valueKey="count"
            />
          )}
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-2">
            <FiBarChart2 className="text-rose-400" />
            <h2 className="text-lg font-bold text-white">Ticket Priority Distribution</h2>
          </div>

          {ticketPriorityDistribution.length === 0 ? (
            <p className="text-sm text-zinc-500">No ticket priority analytics available yet.</p>
          ) : (
            <MiniBarChart
              items={ticketPriorityDistribution}
              colorClass="bg-rose-400"
              labelKey="priority"
              valueKey="count"
            />
          )}
        </div>
      </section>
    </div>
  );
}