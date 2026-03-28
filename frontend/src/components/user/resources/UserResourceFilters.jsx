import { FiSearch } from "react-icons/fi";

export default function UserResourceFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur p-6 transition-all hover:shadow-md">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-orange-400">Browse Resources</h2>
        <p className="mt-1 text-sm text-gray-400">
          Search and filter available campus resources.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-orange-500/30 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-gray-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-2xl border border-orange-500/30 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="ALL">All Types</option>
          <option value="LAB">LAB</option>
          <option value="LECTURE_HALL">LECTURE HALL</option>
          <option value="MEETING_ROOM">MEETING ROOM</option>
          <option value="PROJECTOR">PROJECTOR</option>
          <option value="CAMERA">CAMERA</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-orange-500/30 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>
    </div>
  );
}