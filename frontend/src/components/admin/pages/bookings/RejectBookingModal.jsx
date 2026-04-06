import { useState } from "react";
import toast from "react-hot-toast";
import { FiX, FiAlertCircle, FiSend, FiFlag } from "react-icons/fi";
import { rejectBooking } from "../../../../services/bookingService";

export default function RejectBookingModal({ bookingId, onClose, onRejected }) {
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!remark.trim()) {
      toast.error("Enter a rejection reason");
      return;
    }

    setLoading(true);
    try {
      await rejectBooking(bookingId, remark.trim());
      toast.success("Booking rejected");
      onRejected?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to reject booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-500/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
              <FiFlag size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Reject Booking</h2>
              <p className="text-xs text-zinc-500">Stored as admin remark</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-zinc-400 hover:bg-orange-500/10 hover:text-orange-300"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
            <FiAlertCircle className="mt-0.5 shrink-0 text-red-400" size={18} />
            <p className="text-sm text-zinc-300">
              The booking will be marked as rejected and the reason will be visible to the user.
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-300">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={4}
              maxLength={500}
              disabled={loading}
              className="mt-2 w-full resize-none rounded-xl border border-orange-500/30 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              placeholder="Why is this booking rejected?"
            />
            <p className="mt-1 text-right text-xs text-zinc-500">
              {remark.length}/500
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={loading || !remark.trim()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <FiSend size={16} />
                  Confirm
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-orange-500/30 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-orange-500/10"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}