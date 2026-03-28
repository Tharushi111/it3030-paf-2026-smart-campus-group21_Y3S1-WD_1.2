import {
    FiX,
    FiMapPin,
    FiUsers,
    FiBox,
    FiImage,
    FiCheckCircle,
    FiAlertCircle,
  } from "react-icons/fi";
  
  export default function UserResourceDetailsModal({ resource, onClose }) {
    const imageUrl = resource.imageUrl
      ? `http://localhost:9090${resource.imageUrl}`
      : null;
  
    const isActive = resource.status === "ACTIVE";
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
        {/* Modal container with max height and flex column */}
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          
          {/* Header – fixed */}
          <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-white">
            <div>
              <h2 className="text-2xl font-bold">Resource Details</h2>
              <p className="text-sm text-orange-50">
                View complete information about this resource
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
            >
              <FiX size={18} />
            </button>
          </div>
  
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Image */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={resource.name}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="flex h-72 w-full items-center justify-center text-orange-300">
                  <FiImage size={42} />
                </div>
              )}
            </div>
  
            {/* Title + badges */}
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-3xl font-bold text-slate-800">
                  {resource.name}
                </h3>
  
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  {resource.type}
                </span>
  
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isActive
                      ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                      : "border border-red-200 bg-red-100 text-red-700"
                  }`}
                >
                  {isActive ? "Active" : "Out of Service"}
                </span>
              </div>
  
              <p className="text-sm text-slate-500">Resource ID: {resource.id}</p>
            </div>
  
            {/* Details grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  <FiMapPin />
                  <span className="font-semibold">Location</span>
                </div>
                <p className="text-slate-700">{resource.location}</p>
              </div>
  
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  <FiUsers />
                  <span className="font-semibold">Capacity</span>
                </div>
                <p className="text-slate-700">{resource.capacity}</p>
              </div>
  
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  <FiBox />
                  <span className="font-semibold">Type</span>
                </div>
                <p className="text-slate-700">{resource.type}</p>
              </div>
  
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  {isActive ? <FiCheckCircle /> : <FiAlertCircle />}
                  <span className="font-semibold">Status</span>
                </div>
                <p className="text-slate-700">
                  {isActive ? "Currently Available" : "Currently Unavailable"}
                </p>
              </div>
            </div>
  
            {/* Bottom section */}
            <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-4">
            <h4 className="mb-2 text-lg font-semibold text-slate-800">
                About this resource
            </h4>
            <p className="text-sm leading-6 text-slate-600">
                This resource is part of the <span className="font-semibold text-orange-600">CampusNexus</span> system at SLIIT university. 
                Students can browse available facilities and view resource information before making future booking or usage requests.
            </p>
            </div>
          </div>
  
          {/* Footer – fixed */}
          <div className="border-t border-orange-100 bg-orange-50 px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }