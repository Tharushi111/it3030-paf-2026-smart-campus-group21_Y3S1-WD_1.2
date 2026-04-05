import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
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
  const [editingBooking, setEditingBooking] = useState(null);

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

  const onEdit = (booking) => {
    setEditingBooking(booking);
    setPrefillResourceId(booking.resourceId);
    setModalOpen(true);
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

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 p-8 text-white shadow-lg">
        <div className="relative flex justify-between">
          <div>
            <h1 className="text-4xl font-bold">My bookings</h1>
            <p className="mt-2 text-orange-50">
              View and manage your campus resource reservations.
            </p>
          </div>

          <button
            onClick={load}
            className="flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-sm"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md">
        <div className="grid gap-4 sm:grid-cols-2">

          {/* SEARCH */}
          <div>
            <label className="text-sm font-medium text-slate-600">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-orange-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 border rounded-xl bg-orange-50 text-slate-700 placeholder:text-slate-400"
                placeholder="Search bookings..."
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium text-slate-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 border rounded-xl bg-white text-slate-700"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">No bookings</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => (
            <UserBookingCard
              key={b.id}
              booking={b}
              resource={resourceById[b.resourceId]}
              onCancel={onCancel}
              onEdit={onEdit}
              canCancel={canCancel(b.status)}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <CreateBookingForm
          initialResourceId={prefillResourceId}
          editingBooking={editingBooking}
          onClose={() => {
            setModalOpen(false);
            setEditingBooking(null);
          }}
          onCreated={load}
        />
      )}
    </div>
  );
}