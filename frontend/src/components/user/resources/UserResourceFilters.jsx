import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select option",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-600">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-2xl border border-orange-200 bg-white px-4 py-3 text-left text-slate-700 outline-none transition-all hover:border-orange-300 focus:ring-2 focus:ring-orange-200 ${
          open ? "ring-2 ring-orange-200 border-orange-300" : ""
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`ml-2 text-orange-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown list with modern animation */}
      <div
        ref={dropdownListRef}
        className={`absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-xl transition-all duration-200 ${
          open
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 -translate-y-2"
        }`}
      >
        <div className="max-h-64 overflow-y-auto custom-scroll">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`group block w-full px-4 py-3 text-left text-sm transition-all ${
                  isSelected
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #fff0e6;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #fb923c;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
      `}</style>
    </div>
  );
}

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

        <CustomDropdown
          value={typeFilter}
          options={typeOptions}
          onChange={setTypeFilter}
          placeholder="Select type"
        />

        <CustomDropdown
          value={statusFilter}
          options={statusOptions}
          onChange={setStatusFilter}
          placeholder="Select status"
        />
      </div>
    </div>
  );
}