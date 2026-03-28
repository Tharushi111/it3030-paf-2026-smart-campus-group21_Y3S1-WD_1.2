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
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-orange-600">Browse Resources</h2>
        <p className="mt-1 text-sm text-slate-500">
          Search and filter available campus resources.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-orange-50 py-3 pl-11 pr-4 text-slate-700 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
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
          className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>
    </div>
  );
}