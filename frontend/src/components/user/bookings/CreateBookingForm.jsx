import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiX, FiCalendar } from "react-icons/fi";
import { createBooking, updateBooking } from "../../../services/bookingService";
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
  editingBooking = null,
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
        toast.error("Failed to load resources");
      } finally {
        setLoadingList(false);
      }
    })();
    return () => (cancelled = true);
  }, []);

  // Prefill resource if clicked from Resource Card
  useEffect(() => {
    if (initialResourceId && resources.length) {
      setForm((prev) => ({
        ...prev,
        resourceId: String(initialResourceId),
      }));
    }
  }, [initialResourceId, resources]);

  // Prefill form when editing
  useEffect(() => {
    if (editingBooking) {
      setForm({
        resourceId: String(editingBooking.resourceId),
        date: editingBooking.date,
        startTime: editingBooking.startTime?.slice(0, 5),
        endTime: editingBooking.endTime?.slice(0, 5),
        purpose: editingBooking.purpose,
        attendeeCount: String(editingBooking.attendeeCount),
      });
    }
  }, [editingBooking]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    if (!form.resourceId) return "Please select a resource";
    if (!form.date) return "Date is required";

    const today = new Date().toISOString().split("T")[0];
    if (form.date < today) return "Cannot select past date";

    if (!form.startTime || !form.endTime) return "Time is required";
    if (form.endTime <= form.startTime)
      return "End time must be after start time";

    if (!form.purpose.trim()) return "Purpose is required";

    if (Number(form.attendeeCount) < 1) return "Attendees must be at least 1";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return toast.error(error);

    try {
      setSubmitting(true);

      const payload = {
        resourceId: Number(form.resourceId),
        userId: DEMO_USER_ID,
        date: form.date,
        startTime: toLocalTime(form.startTime),
        endTime: toLocalTime(form.endTime),
        purpose: form.purpose.trim(),
        attendeeCount: Number(form.attendeeCount),
      };

      if (editingBooking) {
        await updateBooking(editingBooking.id, payload);
        toast.success("Booking updated");
      } else {
        await createBooking(payload);
        toast.success("Booking request submitted");
      }

      onCreated?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">
              {editingBooking ? "Edit booking" : "New booking"}
            </h2>
            {editingBooking && (
              <span className="inline-block rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-black">
                Editing
              </span>
            )}
          </div>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Resource */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resource
            </label>
            <select
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-orange-300"
            >
              <option value="">Select a resource</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              min={today}
              value={form.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-orange-300"
            />
          </div>

          {/* Start / End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-orange-300"
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-orange-300"
              placeholder="Meeting, study session, etc."
            />
          </div>

          {/* Attendee Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Attendees</label>
            <input
              type="number"
              name="attendeeCount"
              value={form.attendeeCount}
              onChange={handleChange}
              min={1}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-orange-300"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            >
              <FiSave />
              {editingBooking ? "Update Booking" : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}