import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiX, FiCalendar } from "react-icons/fi";
import { createBooking } from "../../../services/bookingService";
import { getAllResources } from "../../../services/resourceApi";

const DEMO_USER_ID = "user1";

function toLocalTime(value) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

export default function CreateBookingForm({
  onClose,
  onCreated,
  initialResourceId = null,
}) {
  const [resources, setResources] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [form, setForm] = useState({
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendeeCount: "1",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingList(true);
        const res = await getAllResources();
        if (!cancelled) setResources(res.data || []);
      } catch {
        if (!cancelled) toast.error("Failed to load resources");
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (initialResourceId == null || !resources.length) return;
    const idStr = String(initialResourceId);
    const exists = resources.some((r) => String(r.id) === idStr);
    if (exists) {
      setForm((prev) => ({ ...prev, resourceId: idStr }));
    }
  }, [initialResourceId, resources]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resourceId) {
      toast.error("Please select a resource");
      return;
    }
    const n = Number(form.attendeeCount);
    if (!Number.isFinite(n) || n < 1) {
      toast.error("Attendees must be at least 1");
      return;
    }
    if (form.endTime <= form.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        resourceId: Number(form.resourceId),
        userId: DEMO_USER_ID,
        date: form.date,
        startTime: toLocalTime(form.startTime),
        endTime: toLocalTime(form.endTime),
        purpose: form.purpose.trim(),
        attendeeCount: n,
      });
      toast.success("Booking request submitted");
      onCreated?.();
      onClose?.();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      toast.error(typeof msg === "string" ? msg : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-white">
          <div>
            <h2 className="text-2xl font-bold">New booking</h2>
            <p className="text-sm text-orange-50">Reserve a campus resource</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/80 px-4 py-3 text-sm text-slate-600">
            <FiCalendar className="shrink-0 text-orange-500" />
            <span>
              A booking always reserves <strong>one</strong> room or item so we can check the
              schedule and avoid double-booking. Requests stay <strong>pending</strong> until
              staff approve. Demo user: <strong>{DEMO_USER_ID}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Resource *
              </label>
              <p className="mb-2 text-xs text-slate-500">
                Choose what you are booking. If you used <strong>Book</strong> on the Resources
                page, it may already be selected below.
              </p>
              <select
                required
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                disabled={loadingList}
                className="w-full rounded-2xl border border-orange-200 bg-orange-50/50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200 disabled:opacity-60"
              >
                <option value="">
                  {loadingList ? "Loading…" : "Select a resource"}
                </option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.type} ({r.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">Date *</label>
              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-orange-200 bg-orange-50/50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Start *
              </label>
              <input
                required
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">End *</label>
              <input
                required
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Purpose *
              </label>
              <textarea
                required
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                rows={3}
                maxLength={200}
                placeholder="What is this booking for?"
                className="w-full resize-none rounded-2xl border border-orange-200 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Attendees *
              </label>
              <input
                required
                type="number"
                min={1}
                name="attendeeCount"
                value={form.attendeeCount}
                onChange={handleChange}
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-orange-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={submitting || loadingList}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-50"
            >
              <FiSave size={18} />
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
