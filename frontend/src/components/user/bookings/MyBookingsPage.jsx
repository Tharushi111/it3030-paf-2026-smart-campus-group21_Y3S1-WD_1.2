import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";
import { getBookingsByUserId, cancelBooking } from "../../../services/bookingService";
import { getAllResources } from "../../../services/resourceApi";
import CreateBookingForm from "./CreateBookingForm";
import UserBookingCard from "./UserBookingCard";

const DEMO_USER_ID = "user1";

export default function MyBookingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [resourceById, setResourceById] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefillResourceId, setPrefillResourceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const rid = location.state?.resourceId;
    if (rid == null) return;
    setPrefillResourceId(rid);
    setModalOpen(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  const load = async () => {
    try {
      setLoading(true);
      const [bRes, rRes] = await Promise.all([
        getBookingsByUserId(DEMO_USER_ID),
        getAllResources(),
      ]);
      setBookings(bRes.data || []);
      const map = {};
      (rRes.data || []).forEach((r) => {
        map[r.id] = r;
      });
      setResourceById(map);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id, DEMO_USER_ID);
      toast.success("Booking cancelled");
      load();
    } catch {
      toast.error("Could not cancel");
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return bookings.filter((b) => {
      const res = resourceById[b.resourceId];
      const okStatus = statusFilter === "ALL" || b.status === statusFilter;
      const okSearch =
        !q ||
        (res?.name || "").toLowerCase().includes(q) ||
        (res?.location || "").toLowerCase().includes(q) ||
        (b.purpose || "").toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [bookings, searchTerm, statusFilter, resourceById]);

  const canCancel = (s) => s === "PENDING" || s === "APPROVED";

  return (
    <div className="space-y-8">
      {/* Hero — matches UserResourcesPage */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 p-8 text-white shadow-lg">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.25'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">My bookings</h1>
            <p className="mt-2 text-orange-50">
              View and manage your campus resource reservations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/30"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setPrefillResourceId(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 shadow-md transition hover:scale-[1.02]"
            >
              <FiPlus size={18} />
              New booking
            </button>
          </div>
        </div>
      </div>

      {/* Filters — matches UserResourceFilters shell */}
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md transition-all hover:shadow-lg">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-orange-600">Your reservations</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search and filter. Showing bookings for user <strong>{DEMO_USER_ID}</strong>.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="booking-search" className="text-sm font-medium text-slate-600">
              Search
            </label>
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-orange-500"
                size={18}
                aria-hidden
              />
              <input
                id="booking-search"
                type="text"
                placeholder="Name, location, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-2xl border border-orange-200 bg-orange-50 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="booking-status" className="text-sm font-medium text-slate-600">
              Status
            </label>
            <select
              id="booking-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 w-full rounded-2xl border border-orange-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid — matches UserResourceList */}
      {loading ? (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-white px-4 py-14 text-center text-slate-500 shadow-sm">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="text-sm tracking-wide">Loading bookings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-white px-4 py-14 text-center text-slate-500 shadow-sm">
          <p className="text-lg font-semibold text-slate-700">No bookings found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try different filters or create a new booking.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => (
            <UserBookingCard
              key={b.id}
              booking={b}
              resource={resourceById[b.resourceId]}
              onCancel={onCancel}
              canCancel={canCancel(b.status)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <CreateBookingForm
          initialResourceId={prefillResourceId}
          onClose={() => {
            setModalOpen(false);
            setPrefillResourceId(null);
          }}
          onCreated={load}
        />
      )}
    </div>
  );
}
