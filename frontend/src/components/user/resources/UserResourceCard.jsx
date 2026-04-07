import { useState } from "react";
import {
  FiMapPin,
  FiUsers,
  FiImage,
  FiBookOpen,
  FiEye,
} from "react-icons/fi";
import UserResourceDetailsModal from "./UserResourceDetailsModal";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NON_CAPACITY_TYPES = [
  "PROJECTOR",
  "CAMERA",
  "PRINTER",
  "SCANNER",
  "MICROPHONE",
  "SPEAKER",
  "SMART_BOARD",
  "LAB_EQUIPMENT",
];

const NON_BOOKABLE_TYPES = [
  "STUDY_AREA",
  "OPEN_STUDY_AREA",
  "LIBRARY_FLOOR",
  "CANTEEN",
  "CAFETERIA",
];

export default function UserResourceCard({ resource }) {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isActive = resource?.status === "ACTIVE";
  const isBaseBookable =
    isActive && !NON_BOOKABLE_TYPES.includes(resource?.type);
  const canBook = !!user && isBaseBookable;

  const statusClasses = isActive
    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
    : "bg-red-100 text-red-700 border border-red-200";

  const imageUrl = resource?.imageUrl
    ? `http://localhost:9090${resource.imageUrl}`
    : null;

  const isCapacityApplicable = !NON_CAPACITY_TYPES.includes(resource?.type);

  const formatType = (type) => type?.replaceAll("_", " ");

  const getDisabledReason = () => {
    if (!isActive) return "Resource is not available for booking";
    if (NON_BOOKABLE_TYPES.includes(resource?.type)) {
      return `${formatType(resource?.type)} spaces cannot be booked`;
    }
    if (!user) return "Please log in to book this resource";
    return "";
  };

  const disabledReason = getDisabledReason();

  const handleBooking = () => {
    if (!user) {
      toast.error("Please log in to book this resource");
      navigate("/login");
      return;
    }

    if (!isBaseBookable) {
      if (disabledReason) {
        toast.error(disabledReason);
      }
      return;
    }

    navigate("/bookings", {
      state: {
        resourceId: resource.id,
      },
    });
  };

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
        <div className="relative h-44 w-full flex-shrink-0 overflow-hidden bg-orange-50">
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

          <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            {formatType(resource.type)}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex-1">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">
                  {resource.name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                  >
                    {isActive ? "Active" : "Out of Service"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-orange-500" size={14} />
                <span>{resource.location}</span>
              </div>

              {isCapacityApplicable && (
                <div className="flex items-center gap-2">
                  <FiUsers className="text-orange-500" size={14} />
                  <span>Capacity: {resource.capacity}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-100 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-200"
            >
              <FiEye size={14} />
              View Details
            </button>

            <button
              type="button"
              onClick={handleBooking}
              disabled={!canBook}
              title={disabledReason}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                canBook
                  ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md hover:scale-[1.02] hover:shadow-lg"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              <FiBookOpen size={14} />
              {user ? "Book" : "Login to Book"}
            </button>
          </div>
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