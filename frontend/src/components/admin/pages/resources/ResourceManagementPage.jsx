// ResourceManagementPage.jsx
import { useEffect, useMemo, useState } from "react";
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
} from "react-icons/fi";
import AddResourceModal from "./ResourceForm";
import EditResourceModal from "./EditResourceModal";
import {
  createResource,
  deleteResource,
  getAllResources,
  updateResource,
} from "../../../../services/resourceApi";

const TYPE_STYLES = {
  LAB: { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/30" },
  LECTURE_HALL: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30" },
  MEETING_ROOM: { bg: "bg-teal-500/15", text: "text-teal-300", border: "border-teal-500/30" },
  PROJECTOR: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  CAMERA: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30" },
};

function StatCard({ title, value, subtitle, icon, gradient, border }) {
  return (
    <div className={`rounded-2xl border ${border} p-5 shadow-xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 transition-all hover:translate-y-[-2px]`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg text-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm font-semibold text-zinc-300 mt-1">{title}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
    </div>
  );
}

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

  useEffect(() => { fetchResources(); }, []);

  const handleAddResource = async (payload) => {
    try {
      await createResource(payload);
      toast.success("Resource created successfully!");
      setAddModalOpen(false);
      fetchResources();
    } catch {
      toast.error("Failed to create resource");
    }
  };

  const handleSaveEdit = async (updatedResource) => {
    try {
      await updateResource(updatedResource.id, {
        ...updatedResource,
        capacity: Number(updatedResource.capacity),
      });
      toast.success("Resource updated!");
      setEditingResource(null);
      fetchResources();
    } catch {
      toast.error("Failed to update resource");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await deleteResource(id);
      toast.success("Resource deleted");
      fetchResources();
    } catch {
      toast.error("Failed to delete resource");
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [resources, searchTerm, statusFilter, typeFilter]);

  const activeCount = resources.filter((r) => r.status === "ACTIVE").length;
  const outOfServiceCount = resources.filter((r) => r.status === "OUT_OF_SERVICE").length;
  const totalCapacity = resources.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
        .resource-row:hover { background: rgba(251,146,60,0.05); border-color: rgba(251,146,60,0.3); transform: translateX(2px); }
        .fade-in { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        
        /* Style the dropdown options to match the page background */
        select option {
          background: #0a0f1a;
          color: #e2e8f0;
          padding: 8px;
        }
        select option:hover {
          background: rgba(251,146,60,0.2);
        }

        /* Custom scrollbar for the table container - neutral, no orange */
        .table-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .table-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .table-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .table-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>

      {/* Page Header */}
      <section className="flex items-center justify-between fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
              <FiLayers size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold text-orange-400 tracking-widest uppercase">Resource Module</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl font-bold text-white">
            Resource Management
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage all campus facilities, labs, and equipment</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all"
        >
          <FiPlus size={16} />
          Add Resource
        </button>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 fade-in" style={{ animationDelay: "80ms" }}>
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

      {/* Filter Bar - Enhanced with orange border */}
      <section className="fade-in rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 py-4 shadow-md" style={{ animationDelay: "160ms" }}>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.04] border border-orange-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1">
              <FiFilter size={13} className="text-orange-400 flex-shrink-0" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border border-orange-500/30 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500 transition cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="LAB">LAB</option>
                <option value="LECTURE_HALL">LECTURE_HALL</option>
                <option value="MEETING_ROOM">MEETING_ROOM</option>
                <option value="PROJECTOR">PROJECTOR</option>
                <option value="CAMERA">CAMERA</option>
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border border-orange-500/30 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500 transition cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3 text-xs text-zinc-500">
          Showing <span className="text-orange-400 font-semibold mx-1">{filteredResources.length}</span> of <span className="text-orange-400 font-semibold mx-1">{resources.length}</span> resources
        </div>
      </section>

      {/* Resource Table */}
      <section className="fade-in rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 table-scrollbar overflow-x-auto" style={{ animationDelay: "240ms" }}>
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="w-10 h-10 border-2 border-orange-500/30 border-t-orange-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FiBox size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 font-semibold">No resources found</p>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters or add a new resource</p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-300 text-sm font-semibold hover:bg-orange-500/25 transition"
            >
              <FiPlus size={14} /> Add Resource
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-orange-500/20 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-orange-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-orange-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-orange-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-semibold text-orange-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-orange-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-orange-400 uppercase tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => {
                const typeStyle = TYPE_STYLES[resource.type] || { bg: "bg-zinc-700/20", text: "text-zinc-300", border: "border-zinc-500/30" };
                return (
                  <tr key={resource.id} className="resource-row border-b border-white/[0.05] hover:bg-orange-500/5 transition-all">
                    <td className="px-6 py-4 font-medium text-white">{resource.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{resource.capacity}</td>
                    <td className="px-6 py-4 text-zinc-300 flex items-center gap-2">
                      <FiMapPin className="text-orange-400" size={14} />
                      <span>{resource.location}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        resource.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/15 text-red-300 border border-red-500/30"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${resource.status === "ACTIVE" ? "bg-emerald-400" : "bg-red-400"}`} />
                        {resource.status === "ACTIVE" ? "Active" : "Out of Service"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingResource(resource)}
                          className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
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