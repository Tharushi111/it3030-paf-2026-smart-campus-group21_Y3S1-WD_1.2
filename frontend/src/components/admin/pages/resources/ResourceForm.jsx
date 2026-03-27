// AddResourceModal.jsx
import { useState } from "react";
import { FiX, FiPlus, FiType, FiMapPin, FiUsers, FiToggleRight } from "react-icons/fi";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  type: "LAB",
  capacity: "",
  location: "",
  status: "ACTIVE",
};

const TYPES = ["LAB", "LECTURE_HALL", "MEETING_ROOM", "PROJECTOR", "CAMERA"];

export default function AddResourceModal({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Resource name is required"); return; }
    if (!form.location.trim()) { toast.error("Location is required"); return; }
    if (!form.capacity || Number(form.capacity) <= 0) { toast.error("Capacity must be greater than 0"); return; }

    setSubmitting(true);
    try {
      await onSave({ ...form, capacity: Number(form.capacity) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FiPlus className="text-white" size={18} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg font-bold text-white leading-none">
                Add New Resource
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-orange-500/30 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
              <FiType size={11} /> Resource Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Engineering Lab 01"
              className="w-full bg-white/[0.03] border border-orange-500/30 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>

          {/* Type + Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider block">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-orange-500/30 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 transition cursor-pointer"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-950 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
                <FiUsers size={11} /> Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 40"
                className="w-full bg-white/[0.03] border border-orange-500/30 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
              <FiMapPin size={11} /> Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Building A - Floor 2"
              className="w-full bg-white/[0.03] border border-orange-500/30 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
              <FiToggleRight size={11} /> Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["ACTIVE", "OUT_OF_SERVICE"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    form.status === s
                      ? s === "ACTIVE"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-red-500/20 border-red-500/40 text-red-300"
                      : "bg-white/[0.03] border-orange-500/20 text-zinc-500 hover:border-orange-500/40"
                  }`}
                >
                  {s === "ACTIVE" ? "● Active" : "● Out of Service"}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.01] transition-all disabled:opacity-60"
            >
              <FiPlus size={15} />
              {submitting ? "Creating..." : "Create Resource"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-white/[0.04] border border-orange-500/30 text-zinc-400 text-sm font-semibold hover:text-white hover:bg-white/[0.07] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}