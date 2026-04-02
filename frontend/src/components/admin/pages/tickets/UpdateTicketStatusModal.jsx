import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSave, FiX } from "react-icons/fi";
import { updateTicketStatus } from "../../../../services/ticketService";

export default function UpdateTicketStatusModal({ ticket, onClose, onUpdated }) {
  const [status, setStatus] = useState(ticket.status || "OPEN");
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStatus(ticket.status);
    setResolutionNotes(ticket.resolutionNotes || "");
  }, [ticket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateTicketStatus(ticket.id, { status, resolutionNotes });
      toast.success("Ticket updated successfully");
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (error) {
       toast.error("Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-500/20 bg-white/[0.02] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Update Status</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-orange-500/10 hover:text-orange-300"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Ticket Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  placeholder="Explain resolution or reason for rejection..."
                  className="w-full resize-none rounded-xl border border-orange-500/30 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                />
             </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 border-t border-orange-500/20 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-orange-500/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <FiSave size={16} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
