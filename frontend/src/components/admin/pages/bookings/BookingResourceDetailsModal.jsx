import { FiX, FiMapPin, FiUsers, FiImage, FiBox, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function BookingResourceDetailsModal({ resource, onClose }) {
  if (!resource) return null;

  const imageUrl = resource.imageUrl
    ? `http://localhost:9090${resource.imageUrl}`
    : null;

  const isActive = resource.status === "ACTIVE";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        
        {/* Header - sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-orange-500/20 bg-inherit px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">Resource Details</h2>
            <p className="mt-1 text-sm text-zinc-400">
              View complete information about this resource
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition hover:text-white hover:bg-white/10"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
          {/* Image */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-orange-500/20 bg-white/[0.04]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={resource.name}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center text-zinc-500">
                <FiImage size={36} />
              </div>
            )}
          </div>

          {/* Resource Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-400">
                <span className="text-sm font-semibold">Resource Name</span>
              </div>
              <p className="text-sm text-zinc-200">{resource.name}</p>
            </div>

            {/* Type */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-400">
                <FiBox size={14} />
                <span className="text-sm font-semibold">Type</span>
              </div>
              <p className="text-sm text-zinc-200">
                {resource.type?.replaceAll("_", " ")}
              </p>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-400">
                <FiMapPin size={14} />
                <span className="text-sm font-semibold">Location</span>
              </div>
              <p className="text-sm text-zinc-200">{resource.location}</p>
            </div>

            {/* Capacity */}
            {resource.capacity && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-400">
                  <FiUsers size={14} />
                  <span className="text-sm font-semibold">Capacity</span>
                </div>
                <p className="text-sm text-zinc-200">{resource.capacity}</p>
              </div>
            )}

            {/* Status */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-400">
                {isActive ? <FiCheckCircle size={14} /> : <FiAlertCircle size={14} />}
                <span className="text-sm font-semibold">Status</span>
              </div>
              <p className={`text-sm font-medium ${isActive ? "text-emerald-300" : "text-red-300"}`}>
                {resource.status === "ACTIVE" ? "Active" : "Out of Service"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - sticky */}
        <div className="sticky bottom-0 flex justify-end border-t border-orange-500/20 bg-inherit px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
          >
            Close
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251,146,60,0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251,146,60,0.6);
        }
      `}</style>
    </div>
  );
}