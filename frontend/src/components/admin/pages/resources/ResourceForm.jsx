import { useState } from "react";
import {
  FiX,
  FiPlus,
  FiType,
  FiMapPin,
  FiUsers,
  FiToggleRight,
  FiImage
} from "react-icons/fi";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  type: "LAB",
  capacity: "",
  location: "",
  status: "ACTIVE",
  image: null
};

const TYPES = ["LAB", "LECTURE_HALL", "MEETING_ROOM", "PROJECTOR", "CAMERA"];

export default function AddResourceModal({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Resource name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.capacity || Number(form.capacity) <= 0)
      newErrors.capacity = "Capacity must be positive";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("capacity", form.capacity);
      formData.append("location", form.location);
      formData.append("status", form.status);
      if (form.image) {
        formData.append("image", form.image);
      }
      await onSave(formData);
      onClose(); // close modal after success
    } catch (error) {
      toast.error("Failed to create resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl max-h-[90vh] flex flex-col">
        {/* HEADER – sticky */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-orange-500/20 sticky top-0 bg-inherit z-10">
          <h2 className="text-white text-lg font-bold">Add Resource</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* SCROLLABLE FORM AREA */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-orange-400 text-xs font-semibold flex items-center gap-1">
                <FiType size={12} /> Resource Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-orange-500/30 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                placeholder="e.g. Engineering Lab 01"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="text-orange-400 text-xs font-semibold flex items-center gap-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-white/5 border border-orange-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="text-orange-400 text-xs font-semibold flex items-center gap-1">
                <FiUsers size={12} /> Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full bg-white/5 border border-orange-500/30 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                placeholder="e.g. 40"
              />
              {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="text-orange-400 text-xs font-semibold flex items-center gap-1">
                <FiMapPin size={12} /> Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-white/5 border border-orange-500/30 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                placeholder="e.g. Building A - Floor 2"
              />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="text-orange-400 text-xs font-semibold flex items-center gap-1">
                <FiToggleRight size={12} /> Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-white/5 border border-orange-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="text-orange-400 text-xs font-semibold flex items-center gap-1">
                <FiImage size={12} /> Resource Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-white text-sm w-full bg-white/5 border border-orange-500/30 rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
              {preview && (
                <img src={preview} alt="preview" className="mt-3 rounded-xl max-h-40 w-auto object-cover border border-orange-500/30" />
              )}
            </div>
          </form>
        </div>

        {/* BUTTONS – sticky bottom */}
        <div className="px-6 pb-6 pt-2 border-t border-orange-500/20 sticky bottom-0 bg-inherit">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Resource"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 border border-orange-500/30 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}