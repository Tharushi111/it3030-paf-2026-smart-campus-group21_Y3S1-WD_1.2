import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSearch, FiCalendar } from "react-icons/fi";

import {
  getMyBookings,
  cancelBooking,
  deleteBooking,
} from "../../../services/bookingService";

import { getAllResources } from "../../../services/resourceApi";

import CreateBookingForm from "./CreateBookingForm";
import UserBookingCard from "./UserBookingCard";

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
    setEditingBooking(null);
    setModalOpen(true);

    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  const load = async () => {
    try {
      const [bRes, rRes] = await Promise.all([
        getMyBookings(),
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
    load();

    const interval = setInterval(() => {
      load();
    }, 5000); // auto refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const onCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      load();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not cancel booking");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
      load();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not delete booking");
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

      const matchStatus =
        statusFilter === "ALL" || b.status === statusFilter;

      const matchSearch =
        !q ||
        (res?.name || "").toLowerCase().includes(q) ||
        (res?.location || "").toLowerCase().includes(q) ||
        (b.purpose || "").toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [bookings, resourceById, searchTerm, statusFilter]);

  return (
    <div className="space-y-8">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 p-8 text-white shadow-lg">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-4xl font-bold">My Bookings</h1>
            <p className="mt-2 text-orange-50">
              View and manage your campus resource reservations.
            </p>
          </div>

        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md">
        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <label className="text-sm font-medium text-slate-600">Search</label>
            <div className="relative mt-2">
              <FiSearch className="absolute left-3 top-3.5 text-orange-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-orange-200 bg-orange-50 py-3 pl-10 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="Search bookings..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Status</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-orange-200 bg-white p-3 text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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

      {/* Booking List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-orange-100 bg-white py-16 text-center shadow-md">

          <FiCalendar className="mx-auto mb-3 text-orange-300" size={34} />

          <p className="text-lg font-semibold text-slate-700">
            No bookings found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your bookings will appear here after you reserve a resource.
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      {modalOpen && (
        <CreateBookingForm
          initialResourceId={prefillResourceId}
          editingBooking={editingBooking}
          onClose={() => {
            setModalOpen(false);
            setEditingBooking(null);
            setPrefillResourceId(null);
          }}
          onCreated={load}
        />
      )}
    </div>
  );
}