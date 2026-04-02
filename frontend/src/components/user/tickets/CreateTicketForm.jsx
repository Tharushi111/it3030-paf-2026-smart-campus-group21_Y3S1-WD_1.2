import { useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiX, FiInfo } from "react-icons/fi";
import { createTicket } from "../../../services/ticketService";

export default function CreateTicketForm({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "MAINTENANCE",
    priority: "MEDIUM",
    location: "",
    resourceId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = { ...formData, resourceId: formData.resourceId ? Number(formData.resourceId) : null };
      await createTicket(payload);
      toast.success("Ticket created successfully!");
      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-500/20 bg-white/[0.02] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
              <FiInfo size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Incident</h2>
              <p className="text-sm text-zinc-400">Create a new maintenance or incident ticket</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-orange-500/10 hover:text-orange-300"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Ticket Title *</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Projector in Lab A is not turning on"
                className="w-full rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Location *</label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lab 402, Building A"
                className="w-full rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Resource ID (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Resource ID</label>
              <input
                type="number"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                placeholder="Target resource ID if known"
                className="w-full rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INCIDENT">Incident</option>
                <option value="SOFTWARE">Software Issue</option>
                <option value="HARDWARE">Hardware Issue</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Description *</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Please describe the issue in detail..."
                className="w-full resize-none rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex justify-end gap-3 border-t border-orange-500/20 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-orange-500/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/40 disabled:opacity-50 disabled:hover:scale-100"
            >
              <FiSave size={16} />
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
