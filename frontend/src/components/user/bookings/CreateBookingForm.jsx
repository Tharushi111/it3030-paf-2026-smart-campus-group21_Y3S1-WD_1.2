import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiX,
  FiSave,
  FiCalendar,
  FiClock,
  FiUsers,
  FiFileText,
  FiMapPin,
  FiGrid,
  FiImage,
} from "react-icons/fi";
import { createBooking, updateBooking } from "../../../services/bookingService";
import { getAllResources } from "../../../services/resourceApi";

function RequiredMark() {
  return <span className="ml-1 text-red-500">*</span>;
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-slate-700">{value || "—"}</p>
    </div>
  );
}

export default function CreateBookingForm({
  onClose,
  onCreated,
  initialResourceId = null,
  editingBooking = null,
}) {
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendeeCount: "1",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    const loadResources = async () => {
      try {
        setLoadingResources(true);
        const res = await getAllResources();
        if (!cancelled) {
          setResources(res.data || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load resources");
      } finally {
        if (!cancelled) setLoadingResources(false);
      }
    };

    loadResources();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (editingBooking) {
      setForm({
        resourceId: String(editingBooking.resourceId ?? ""),
        date: editingBooking.date || "",
        startTime: editingBooking.startTime?.slice(0, 5) || "",
        endTime: editingBooking.endTime?.slice(0, 5) || "",
        purpose: editingBooking.purpose || "",
        attendeeCount: String(editingBooking.attendeeCount ?? 1),
      });
      return;
    }

    if (initialResourceId != null) {
      setForm((prev) => ({
        ...prev,
        resourceId: String(initialResourceId),
      }));
    }
  }, [editingBooking, initialResourceId]);

  const selectedResource = useMemo(() => {
    return resources.find((r) => String(r.id) === String(form.resourceId)) || null;
  }, [resources, form.resourceId]);

  const imageUrl = selectedResource?.imageUrl
    ? `http://localhost:9090${selectedResource.imageUrl}`
    : null;

  const today = new Date().toISOString().split("T")[0];

  const setField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.resourceId) {
      nextErrors.resourceId = "Selected resource not found";
    }

    if (!form.date) {
      nextErrors.date = "Date is required";
    } else if (form.date < today) {
      nextErrors.date = "Booking date cannot be in the past";
    }

    if (!form.startTime) {
      nextErrors.startTime = "Start time is required";
    }

    if (!form.endTime) {
      nextErrors.endTime = "End time is required";
    }

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      nextErrors.endTime = "End time must be after start time";
    }

    if (!form.purpose.trim()) {
      nextErrors.purpose = "Purpose is required";
    } else if (form.purpose.trim().length < 5) {
      nextErrors.purpose = "Purpose should be at least 5 characters";
    } else if (form.purpose.trim().length > 200) {
      nextErrors.purpose = "Purpose must not exceed 200 characters";
    }

    const attendeeCount = Number(form.attendeeCount);
    if (!form.attendeeCount || Number.isNaN(attendeeCount)) {
      nextErrors.attendeeCount = "Attendee count is required";
    } else if (attendeeCount < 1) {
      nextErrors.attendeeCount = "Attendee count must be at least 1";
    } else if (
      selectedResource?.capacity != null &&
      attendeeCount > Number(selectedResource.capacity)
    ) {
      nextErrors.attendeeCount = "Attendee count exceeds resource capacity";
    }

    if (selectedResource?.status && selectedResource.status !== "ACTIVE") {
      nextErrors.resourceId = "Only ACTIVE resources can be booked";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }

    const payload = {
      date: form.date,
      startTime: `${form.startTime}:00`,
      endTime: `${form.endTime}:00`,
      purpose: form.purpose.trim(),
      attendeeCount: Number(form.attendeeCount),
    };

    try {
      setSubmitting(true);

      if (editingBooking) {
        await updateBooking(editingBooking.id, Number(form.resourceId), payload);
        toast.success("Booking updated successfully");
      } else {
        await createBooking(Number(form.resourceId), payload);
        toast.success("Booking request submitted successfully");
      }

      onCreated?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-orange-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-5 text-white">
          <div>
            <h2 className="text-2xl font-bold">
              {editingBooking ? "Edit Booking" : "Create Booking"}
            </h2>
            <p className="mt-1 text-sm text-orange-50">
              Reserve your selected campus resource
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 transition hover:bg-white/10"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                {/* Selected Resource fixed field */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Selected Resource
                    <RequiredMark />
                  </label>

                  <div
                    className={`mt-2 rounded-2xl border bg-white px-4 py-3 shadow-sm ${
                      errors.resourceId
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiGrid className="text-orange-500" size={18} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {selectedResource?.name || "No resource selected"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {selectedResource?.location || "Open the booking form from a resource card"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {errors.resourceId && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.resourceId}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Booking Date
                      <RequiredMark />
                    </label>
                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${
                        errors.date
                          ? "border-red-400 ring-1 ring-red-200"
                          : "border-orange-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                      }`}
                    >
                      <FiCalendar className="text-orange-500" size={18} />
                      <input
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={(e) => setField("date", e.target.value)}
                        disabled={submitting}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Attendee Count
                      <RequiredMark />
                    </label>
                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${
                        errors.attendeeCount
                          ? "border-red-400 ring-1 ring-red-200"
                          : "border-orange-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                      }`}
                    >
                      <FiUsers className="text-orange-500" size={18} />
                      <input
                        type="number"
                        min="1"
                        value={form.attendeeCount}
                        onChange={(e) => setField("attendeeCount", e.target.value)}
                        disabled={submitting}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none"
                        placeholder="Enter number of attendees"
                      />
                    </div>
                    {errors.attendeeCount && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.attendeeCount}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Start Time
                      <RequiredMark />
                    </label>
                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${
                        errors.startTime
                          ? "border-red-400 ring-1 ring-red-200"
                          : "border-orange-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                      }`}
                    >
                      <FiClock className="text-orange-500" size={18} />
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => setField("startTime", e.target.value)}
                        disabled={submitting}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      />
                    </div>
                    {errors.startTime && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.startTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      End Time
                      <RequiredMark />
                    </label>
                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${
                        errors.endTime
                          ? "border-red-400 ring-1 ring-red-200"
                          : "border-orange-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                      }`}
                    >
                      <FiClock className="text-orange-500" size={18} />
                      <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => setField("endTime", e.target.value)}
                        disabled={submitting}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      />
                    </div>
                    {errors.endTime && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Purpose
                    <RequiredMark />
                  </label>
                  <div
                    className={`mt-2 flex items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${
                      errors.purpose
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-orange-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                    }`}
                  >
                    <FiFileText className="mt-0.5 text-orange-500" size={18} />
                    <textarea
                      rows={4}
                      value={form.purpose}
                      onChange={(e) => setField("purpose", e.target.value)}
                      disabled={submitting}
                      placeholder="Example: Team presentation practice, workshop, project discussion..."
                      className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none"
                    />
                  </div>
                  {errors.purpose && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.purpose}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800">
                    Selected Resource
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Booking details based on the chosen resource
                  </p>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-orange-100 bg-white">
                    <div className="h-40 w-full overflow-hidden bg-orange-50">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={selectedResource?.name || "Selected resource"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-orange-300">
                          <FiImage size={30} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <InfoCard
                      icon={<FiGrid size={13} />}
                      label="Name"
                      value={selectedResource?.name}
                    />
                    <InfoCard
                      icon={<FiMapPin size={13} />}
                      label="Location"
                      value={selectedResource?.location}
                    />
                    <InfoCard
                      icon={<FiUsers size={13} />}
                      label="Capacity"
                      value={
                        selectedResource?.capacity != null
                          ? String(selectedResource.capacity)
                          : "Not specified"
                      }
                    />
                    <InfoCard
                      icon={<FiCalendar size={13} />}
                      label="Status"
                      value={selectedResource?.status || "—"}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-orange-500">
                    Booking Rules
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>• Booking date cannot be in the past.</p>
                    <p>• End time must be after start time.</p>
                    <p>• Only active resources can be booked.</p>
                    <p>• Attendees cannot exceed resource capacity.</p>
                    <p>• Overlapping slots will be rejected.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-orange-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-2xl border border-orange-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !selectedResource}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                <FiSave size={16} />
                {submitting
                  ? editingBooking
                    ? "Updating..."
                    : "Submitting..."
                  : editingBooking
                  ? "Update Booking"
                  : "Submit Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}