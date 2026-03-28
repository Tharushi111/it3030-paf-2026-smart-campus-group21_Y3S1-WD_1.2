import { FiBox, FiMapPin, FiUsers } from "react-icons/fi";

export default function UserResourceCard({ resource }) {
  const statusClasses =
    resource.status === "ACTIVE"
      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
      : "bg-red-500/20 text-red-300 border border-red-500/30";

  return (
    <div className="group rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur p-5 transition-all hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{resource.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300">
              {resource.type}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}>
              {resource.status}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-2 text-white shadow-md transition-all group-hover:scale-105">
          <FiBox size={18} />
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <FiMapPin className="text-orange-400" size={14} />
          <span>{resource.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUsers className="text-orange-400" size={14} />
          <span>Capacity: {resource.capacity}</span>
        </div>
      </div>

      <button className="mt-4 w-full rounded-xl bg-orange-500/20 py-2 text-sm font-medium text-orange-300 transition hover:bg-orange-500/30">
        View Details
      </button>
    </div>
  );
}