import { useEffect, useState } from "react";
import { FiX, FiSave, FiEdit2, FiMapPin, FiUsers, FiToggleRight } from "react-icons/fi";

const TYPES = ["LAB", "LECTURE_HALL", "MEETING_ROOM", "PROJECTOR", "CAMERA"];

export default function EditResourceModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState(resource);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(resource);
    setErrors({}); // reset errors when resource changes
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Resource name is required";
    if (!form.location?.trim()) newErrors.location = "Location is required";
    if (!form.capacity || Number(form.capacity) <= 0) newErrors.capacity = "Capacity must be a positive number";
    if (!form.type) newErrors.type = "Type is required";
    if (!form.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(form);
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <FiEdit2 className="text-white" size={16} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg font-bold text-white leading-none">
                Edit Resource
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Update resource details</p>
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
              Resource Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full bg-white/[0.03] border ${errors.name ? "border-red-500/70" : "border-orange-500/30"} rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Type + Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
                Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full bg-white/[0.03] border ${errors.type ? "border-red-500/70" : "border-orange-500/30"} rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 transition cursor-pointer`}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-950 text-white">
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-400 mt-1">{errors.type}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
                <FiUsers size={11} /> Capacity <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className={`w-full bg-white/[0.03] border ${errors.capacity ? "border-red-500/70" : "border-orange-500/30"} rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition`}
              />
              {errors.capacity && <p className="text-xs text-red-400 mt-1">{errors.capacity}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
              <FiMapPin size={11} /> Location <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`w-full bg-white/[0.03] border ${errors.location ? "border-red-500/70" : "border-orange-500/30"} rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition`}
            />
            {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-orange-400/80 mb-2 uppercase tracking-wider">
              <FiToggleRight size={11} /> Status <span className="text-red-500 ml-1">*</span>
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
            {errors.status && <p className="text-xs text-red-400 mt-1">{errors.status}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] transition-all"
            >
              <FiSave size={15} />
              Save Changes
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