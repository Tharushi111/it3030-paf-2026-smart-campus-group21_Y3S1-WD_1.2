import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBox,
  FiCheckCircle,
  FiEdit2,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiAlertCircle,
  FiFilter,
  FiLayers,
  FiImage,
  FiChevronDown,
} from "react-icons/fi";
import AddResourceModal from "./ResourceForm";
import EditResourceModal from "./EditResourceModal";
import {
  createResource,
  deleteResource,
  getAllResources,
  updateResource,
} from "../../../../services/resourceApi";

//Custom Dropdown Component
function CustomDropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-3 py-2.5 text-sm text-white outline-none transition-all hover:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 ${
          open ? "ring-2 ring-orange-500/20 border-orange-500/40" : ""
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`ml-2 text-orange-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-xl">
          <div className="max-h-64 overflow-y-auto custom-scroll">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-4 py-2.5 text-left text-sm transition-all ${
                  option.value === value
                    ? "bg-orange-500/20 text-orange-300 font-semibold"
                    : "text-zinc-300 hover:bg-orange-500/10 hover:text-orange-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(251,146,60,0.4);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(251,146,60,0.6);
        }
      `}</style>
    </div>
  );
}

// Extended TYPE_STYLES for all resource types
const TYPE_STYLES = {
  LAB: {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  LECTURE_HALL: {
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    border: "border-violet-500/30",
  },
  MEETING_ROOM: {
    bg: "bg-teal-500/15",
    text: "text-teal-300",
    border: "border-teal-500/30",
  },
  AUDITORIUM: {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  LIBRARY_FLOOR: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
  },
  STUDY_AREA: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
  },
  OPEN_STUDY_AREA: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    border: "border-sky-500/30",
  },
  CANTEEN: {
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    border: "border-orange-500/30",
  },
  CAFETERIA: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  PROJECTOR: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  CAMERA: {
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
  PRINTER: {
    bg: "bg-gray-500/15",
    text: "text-gray-300",
    border: "border-gray-500/30",
  },
  SCANNER: {
    bg: "bg-gray-500/15",
    text: "text-gray-300",
    border: "border-gray-500/30",
  },
  MICROPHONE: {
    bg: "bg-slate-500/15",
    text: "text-slate-300",
    border: "border-slate-500/30",
  },
  SPEAKER: {
    bg: "bg-stone-500/15",
    text: "text-stone-300",
    border: "border-stone-500/30",
  },
  SMART_BOARD: {
    bg: "bg-fuchsia-500/15",
    text: "text-fuchsia-300",
    border: "border-fuchsia-500/30",
  },
  LAB_EQUIPMENT: {
    bg: "bg-zinc-500/15",
    text: "text-zinc-300",
    border: "border-zinc-500/30",
  },
};

function StatCard({ title, value, subtitle, icon, gradient, border }) {
  return (
    <div
      className={`rounded-2xl border ${border} p-5 shadow-xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 transition-all hover:-translate-y-[2px]`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-300">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

function ResourceImageCell({ resource }) {
  const imageSrc = resource.imageUrl
    ? `http://localhost:9090${resource.imageUrl}`
    : null;

  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-20 overflow-hidden rounded-xl border border-orange-500/20 bg-white/[0.04]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={resource.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">
            <FiImage size={16} />
          </div>
        )}
      </div>
      <div>
        <p className="font-medium text-white">{resource.name}</p>
      </div>
    </div>
  );
}

// Options for custom dropdowns
const typeOptions = [
  { value: "ALL", label: "All Types" },
  { value: "LAB", label: "LAB" },
  { value: "LECTURE_HALL", label: "LECTURE HALL" },
  { value: "MEETING_ROOM", label: "MEETING ROOM" },
  { value: "AUDITORIUM", label: "AUDITORIUM" },
  { value: "LIBRARY_FLOOR", label: "LIBRARY FLOOR" },
  { value: "STUDY_AREA", label: "STUDY AREA" },
  { value: "OPEN_STUDY_AREA", label: "OPEN STUDY AREA" },
  { value: "CANTEEN", label: "CANTEEN" },
  { value: "CAFETERIA", label: "CAFETERIA" },
  { value: "PROJECTOR", label: "PROJECTOR" },
  { value: "CAMERA", label: "CAMERA" },
  { value: "PRINTER", label: "PRINTER" },
  { value: "SCANNER", label: "SCANNER" },
  { value: "MICROPHONE", label: "MICROPHONE" },
  { value: "SPEAKER", label: "SPEAKER" },
  { value: "SMART_BOARD", label: "SMART BOARD" },
  { value: "LAB_EQUIPMENT", label: "LAB EQUIPMENT" },
];

const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
];

export default function ResourceManagementPage() {
  const [resources, setResources] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getAllResources();
      setResources(response.data);
    } catch (error) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddResource = async (formData) => {
    try {
      await createResource(formData);
      toast.success("Resource created successfully");
      setAddModalOpen(false);
      fetchResources();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEdit = async (id, formData) => {
    try {
      await updateResource(id, formData);
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this resource?");
    if (!confirmed) return;

    try {
      await deleteResource(id);
      toast.success("Resource deleted");
      fetchResources();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resource");
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const matchesType = typeFilter === "ALL" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [resources, searchTerm, statusFilter, typeFilter]);

  const activeCount = resources.filter((r) => r.status === "ACTIVE").length;
  const outOfServiceCount = resources.filter(
    (r) => r.status === "OUT_OF_SERVICE"
  ).length;
  const totalCapacity = resources.reduce(
    (sum, r) => sum + (Number(r.capacity) || 0),
    0
  );

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');

        .resource-row:hover {
          background: rgba(251, 146, 60, 0.05);
          border-color: rgba(251, 146, 60, 0.3);
          transform: translateX(2px);
        }

        .fade-in {
          animation: fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .table-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 8px;
        }

        .table-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }

        .table-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251,146,60,0.35);
          border-radius: 10px;
        }

        .table-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251,146,60,0.5);
        }
      `}</style>

      {/* Page Header */}
      <section className="fade-in flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              <FiLayers size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Resource Module
            </span>
          </div>
          <h1
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-3xl font-bold text-white"
          >
            Resource Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage campus facilities, equipment, and uploaded resource images
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/40"
        >
          <FiPlus size={16} />
          Add Resource
        </button>
      </section>

      {/* Stats */}
      <section
        className="fade-in grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        style={{ animationDelay: "80ms" }}
      >
        <StatCard
          title="Total Resources"
          value={resources.length}
          subtitle="All registered facilities"
          icon={<FiBox />}
          gradient="from-orange-500 to-amber-400"
          border="border-orange-500/20"
        />
        <StatCard
          title="Active Resources"
          value={activeCount}
          subtitle="Available for booking"
          icon={<FiCheckCircle />}
          gradient="from-emerald-500 to-teal-400"
          border="border-emerald-500/20"
        />
        <StatCard
          title="Out of Service"
          value={outOfServiceCount}
          subtitle="Currently unavailable"
          icon={<FiAlertCircle />}
          gradient="from-rose-500 to-pink-400"
          border="border-rose-500/20"
        />
        <StatCard
          title="Total Capacity"
          value={totalCapacity.toLocaleString()}
          subtitle="Combined seat count"
          icon={<FiUsers />}
          gradient="from-violet-500 to-purple-400"
          border="border-violet-500/20"
        />
      </section>

      {/* Filter Bar with Custom Dropdowns – added relative and z-10 */}
      <section
        className="fade-in relative z-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 py-4 shadow-md"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <div className="relative w-full flex-1">
            <FiSearch
              size={14}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            />
            <input
              type="text"
              placeholder="Search by name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-orange-500/30 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex w-full gap-3 md:w-auto">
            <div className="flex-1">
              <CustomDropdown
                value={typeFilter}
                options={typeOptions}
                onChange={setTypeFilter}
                placeholder="Select type"
              />
            </div>
            <div className="flex-1">
              <CustomDropdown
                value={statusFilter}
                options={statusOptions}
                onChange={setStatusFilter}
                placeholder="Select status"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
          Showing
          <span className="mx-1 font-semibold text-orange-400">
            {filteredResources.length}
          </span>
          of
          <span className="mx-1 font-semibold text-orange-400">
            {resources.length}
          </span>
          resources
        </div>
      </section>

      {/* Resource Table */}
      <section
        className="table-scrollbar fade-in overflow-x-auto rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
        style={{ animationDelay: "240ms" }}
      >
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
            <p className="text-sm text-zinc-500">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FiBox size={32} className="mx-auto mb-3 text-zinc-700" />
            <p className="font-semibold text-zinc-400">No resources found</p>
            <p className="mt-1 text-sm text-zinc-600">
              Try adjusting your filters or add a new resource
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/25"
            >
              <FiPlus size={14} /> Add Resource
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-orange-500/20 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Resource
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Capacity
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Actions
                </th>
               </tr>
            </thead>

            <tbody>
              {filteredResources.map((resource) => {
                const typeStyle = TYPE_STYLES[resource.type] || {
                  bg: "bg-zinc-700/20",
                  text: "text-zinc-300",
                  border: "border-zinc-500/30",
                };

                return (
                  <tr
                    key={resource.id}
                    className="resource-row border-b border-white/[0.05] transition-all hover:bg-orange-500/5"
                  >
                    <td className="px-6 py-4">
                      <ResourceImageCell resource={resource} />
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                      >
                        {resource.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      {resource.capacity}
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-orange-400" size={14} />
                        <span>{resource.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                          resource.status === "ACTIVE"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                            : "border-red-500/30 bg-red-500/15 text-red-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            resource.status === "ACTIVE"
                              ? "bg-emerald-400"
                              : "bg-red-400"
                          }`}
                        />
                        {resource.status === "ACTIVE"
                          ? "Active"
                          : "Out of Service"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingResource(resource)}
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition hover:bg-amber-500/20"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Modals */}
      {addModalOpen && (
        <AddResourceModal
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddResource}
        />
      )}

      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}