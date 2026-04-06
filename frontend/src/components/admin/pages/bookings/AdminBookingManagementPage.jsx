import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiSearch,
  FiTrash2,
  FiClock,
  FiMapPin,
  FiLayers,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUsers,
  FiEye,
} from "react-icons/fi";
import {
  getAllBookings,
  approveBooking,
  deleteBooking,
} from "../../../../services/bookingService";
import { getAllResources } from "../../../../services/resourceApi";
import RejectBookingModal from "./RejectBookingModal";
import BookingResourceDetailsModal from "./BookingResourceDetailsModal";

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

function formatTime(t) {
  if (t == null) return "—";
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

export default function AdminBookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [resourceById, setResourceById] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rejectingId, setRejectingId] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [bRes, rRes] = await Promise.all([
        getAllBookings(),
        getAllResources(),
      ]);

      setBookings(bRes.data || []);

      const map = {};
      (rRes.data || []).forEach((r) => {
        map[r.id] = r;
      });
      setResourceById(map);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking?")) return;

    try {
      await approveBooking(id);
      toast.success("Booking approved");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Approve failed");
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return bookings.filter((b) => {
      const res = resourceById[b.resourceId];
      const name = (res?.name || "").toLowerCase();
      const loc = (res?.location || "").toLowerCase();
      const purpose = (b.purpose || "").toLowerCase();
      const userEmail = (b.userEmail || "").toLowerCase();

      const matchQ =
        !q ||
        name.includes(q) ||
        loc.includes(q) ||
        purpose.includes(q) ||
        userEmail.includes(q) ||
        String(b.resourceId).includes(q);

      const matchS = statusFilter === "ALL" || b.status === statusFilter;

      return matchQ && matchS;
    });
  }, [bookings, searchTerm, statusFilter, resourceById]);

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const approved = bookings.filter((b) => b.status === "APPROVED").length;
  const rejected = bookings.filter((b) => b.status === "REJECTED").length;

  const statusBadge = (status) => {
    const base =
      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold";

    switch (status) {
      case "PENDING":
        return (
          <span
            className={`${base} border-amber-500/30 bg-amber-500/15 text-amber-300`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        );
      case "APPROVED":
        return (
          <span
            className={`${base} border-emerald-500/30 bg-emerald-500/15 text-emerald-300`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span
            className={`${base} border-red-500/30 bg-red-500/15 text-red-300`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Rejected
          </span>
        );
      case "CANCELLED":
        return (
          <span
            className={`${base} border-zinc-500/30 bg-zinc-500/15 text-zinc-300`}
          >
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
        .fade-in { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .booking-row:hover { background: rgba(251, 146, 60, 0.05); }
        .table-scrollbar::-webkit-scrollbar { height: 6px; width: 8px; }
        .table-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .table-scrollbar::-webkit-scrollbar-thumb { background: rgba(251,146,60,0.35); border-radius: 10px; }
        .table-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251,146,60,0.5); }
      `}</style>

      <section className="fade-in flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              <FiCalendar size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Booking Module
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Booking Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Approve, reject, and manage campus resource reservations.
          </p>
        </div>
      </section>

      <section className="fade-in grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All records"
          icon={<FiLayers />}
          gradient="from-orange-500 to-amber-400"
          border="border-orange-500/20"
        />
        <StatCard
          title="Pending"
          value={pending}
          subtitle="Awaiting decision"
          icon={<FiAlertCircle />}
          gradient="from-amber-500 to-orange-400"
          border="border-amber-500/20"
        />
        <StatCard
          title="Approved"
          value={approved}
          subtitle="Confirmed"
          icon={<FiCheckCircle />}
          gradient="from-emerald-500 to-teal-400"
          border="border-emerald-500/20"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          subtitle="Declined"
          icon={<FiXCircle />}
          gradient="from-rose-500 to-pink-400"
          border="border-rose-500/20"
        />
      </section>

      <section className="fade-in relative z-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 py-4 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="flex min-w-0 flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-orange-400/90">
              Search
            </label>
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-orange-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Resource, location, user, purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-xl border border-orange-500/30 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-2 md:w-52 md:flex-shrink-0">
            <label className="text-xs font-semibold uppercase tracking-wide text-orange-400/90">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 text-sm text-white outline-none focus:border-orange-500"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          Showing{" "}
          <span className="font-semibold text-orange-400">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-orange-400">
            {bookings.length}
          </span>{" "}
          bookings
        </div>
      </section>

      <section className="table-scrollbar fade-in overflow-x-auto rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FiCalendar size={32} className="mx-auto mb-3 text-zinc-700" />
            <p className="font-semibold text-zinc-400">No bookings found</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-orange-500/20 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Booking
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Attendees
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => {
                const res = resourceById[b.resourceId];

                return (
                  <tr
                    key={b.id}
                    className="booking-row border-b border-white/[0.05] transition-all hover:bg-orange-500/5"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {res?.name || `Resource #${b.resourceId}`}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                        <FiMapPin size={12} />
                        {res?.location || "—"}
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">
                        User: {b.userEmail}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        {b.purpose}
                      </p>

                      {b.status === "REJECTED" && b.adminRemark && (
                        <p className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-200">
                          {b.adminRemark}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-white">{b.date}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                        <FiClock size={12} />
                        {formatTime(b.startTime)} – {formatTime(b.endTime)}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top text-sm text-zinc-300">
                      <span className="inline-flex items-center gap-1">
                        <FiUsers size={14} className="text-orange-400/70" />
                        {b.attendeeCount}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top">
                      {statusBadge(b.status)}
                    </td>

                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedResource(res)}
                          className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2 text-sky-300 hover:bg-sky-500/20"
                          title="View Resource"
                          disabled={!res}
                        >
                          <FiEye size={14} />
                        </button>

                        {b.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(b.id)}
                              className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500/20"
                              title="Approve"
                            >
                              <FiCheckCircle size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingId(b.id)}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
                              title="Reject"
                            >
                              <FiXCircle size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(b.id)}
                              className="rounded-lg border border-slate-500/20 bg-slate-500/10 p-2 text-slate-300 hover:bg-slate-500/20"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {rejectingId != null && (
        <RejectBookingModal
          bookingId={rejectingId}
          onClose={() => setRejectingId(null)}
          onRejected={fetchData}
        />
      )}

      {selectedResource && (
        <BookingResourceDetailsModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}