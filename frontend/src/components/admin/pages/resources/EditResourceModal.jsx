import { useEffect, useState } from "react";
import { FiX, FiSave, FiImage, FiType, FiMapPin, FiUsers, FiToggleRight } from "react-icons/fi";
import toast from "react-hot-toast";

const TYPES = ["LAB", "LECTURE_HALL", "MEETING_ROOM", "PROJECTOR", "CAMERA"];

export default function EditResourceModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState(resource);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(resource);
    // Set initial preview from existing image URL if available
    if (resource?.imageUrl) {
      setPreview(resource.imageUrl);
    } else {
      setPreview(null);
    }
    setImageFile(null);
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("capacity", form.capacity);
      formData.append("location", form.location);
      formData.append("status", form.status);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await onSave(resource.id, formData);
      toast.success("Resource updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-orange-500/20 sticky top-0 bg-inherit z-10">
          <h2 className="text-white text-lg font-bold">Edit Resource</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <form id="editResourceForm" onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Resource name"
              />
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
                <img
                  src={preview.startsWith("blob:") ? preview : (preview.startsWith("http") ? preview : `http://localhost:9090${preview}`)}
                  alt="preview"
                  className="mt-3 rounded-xl max-h-40 w-auto object-cover border border-orange-500/30"
                />
              )}
            </div>
          </form>
        </div>

        {/* Buttons - Sticky Bottom */}
        <div className="px-6 pb-6 pt-2 border-t border-orange-500/20 sticky bottom-0 bg-inherit">
          <div className="flex gap-3">
            <button
              type="submit"
              form="editResourceForm"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <FiSave size={16} />
              {submitting ? "Saving..." : "Save Changes"}
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