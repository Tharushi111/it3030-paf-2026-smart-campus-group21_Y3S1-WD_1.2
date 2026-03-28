import { useState } from "react";
import { FiMapPin, FiUsers, FiImage } from "react-icons/fi";
import UserResourceDetailsModal from "./UserResourceDetailsModal";

export default function UserResourceCard({ resource }) {
  const [showDetails, setShowDetails] = useState(false);

  const statusClasses =
    resource.status === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-red-100 text-red-700 border border-red-200";

  const imageUrl = resource.imageUrl
    ? `http://localhost:9090${resource.imageUrl}`
    : null;

  return (
    <>
      <div className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
        {/* Resource Image */}
        <div className="relative h-44 w-full overflow-hidden bg-orange-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={resource.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-orange-300">
              <FiImage size={30} />
            </div>
          )}

          {/* Type badge */}
          <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            {resource.type}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">
                {resource.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                >
                  {resource.status === "ACTIVE" ? "Active" : "Out of Service"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-orange-500" size={14} />
              <span>{resource.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiUsers className="text-orange-500" size={14} />
              <span>Capacity: {resource.capacity}</span>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(true)}
            className="mt-4 w-full rounded-xl bg-orange-100 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-200"
          >
            View Details
          </button>
        </div>
      </div>

      {showDetails && (
        <UserResourceDetailsModal
          resource={resource}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}