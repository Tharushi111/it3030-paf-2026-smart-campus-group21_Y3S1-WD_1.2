import { useState, useRef, useEffect } from "react";
import {
  FiX,
  FiType,
  FiMapPin,
  FiUsers,
  FiToggleRight,
  FiImage,
  FiChevronDown,
} from "react-icons/fi";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  type: "LAB",
  capacity: "",
  location: "",
  status: "ACTIVE",
  image: null,
};

const TYPES = [
  "LAB",
  "LECTURE_HALL",
  "MEETING_ROOM",
  "AUDITORIUM",
  "LIBRARY_FLOOR",
  "STUDY_AREA",
  "OPEN_STUDY_AREA",
  "CANTEEN",
  "CAFETERIA",
  "PROJECTOR",
  "CAMERA",
  "PRINTER",
  "SCANNER",
  "MICROPHONE",
  "SPEAKER",
  "SMART_BOARD",
  "LAB_EQUIPMENT",
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "OUT_OF_SERVICE", label: "OUT OF SERVICE" },
];

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

function CustomDropdown({ value, options, onChange, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

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
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-white outline-none transition-all hover:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 ${
          open
            ? "border-orange-500/40 ring-2 ring-orange-500/20"
            : error
            ? "border-red-500/50 bg-white/5"
            : "border-orange-500/30 bg-white/5"
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
          <div className="max-h-56 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm transition ${
                  option.value === value
                    ? "bg-orange-500/20 font-semibold text-orange-300"
                    : "text-zinc-300 hover:bg-orange-500/10 hover:text-orange-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const validateText = (text) => {
  const regex = /^[a-zA-Z0-9\s\-_\.'(),]+$/;
  return regex.test(text);
};

export default function AddResourceModal({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isCapacityRequired = !NON_CAPACITY_TYPES.includes(form.type);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "name" || name === "location") {
      value = value.replace(/[^a-zA-Z0-9\s\-_\.'(),]/g, "");
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (val) => {
    setForm((prev) => ({
      ...prev,
      type: val,
      capacity: NON_CAPACITY_TYPES.includes(val) ? "" : prev.capacity,
    }));

    setErrors((prev) => ({
      ...prev,
      type: "",
      capacity: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      setPreview(null);
      setForm((prev) => ({ ...prev, image: null }));
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, GIF, and WEBP images are allowed",
      }));
      setPreview(null);
      setForm((prev) => ({ ...prev, image: null }));
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Resource name is required";
    } else if (!validateText(form.name)) {
      newErrors.name =
        "Resource name cannot contain special characters like @, #, $, %";
    }

    if (!form.type) {
      newErrors.type = "Type is required";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!validateText(form.location)) {
      newErrors.location =
        "Location cannot contain special characters like @, #, $, %";
    }

    if (isCapacityRequired) {
      if (!form.capacity || Number(form.capacity) <= 0) {
        newErrors.capacity = "Capacity must be a positive number";
      }
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("location", form.location);
      formData.append("status", form.status);

      if (isCapacityRequired) {
        formData.append("capacity", form.capacity);
      }

      if (form.image) {
        formData.append("image", form.image);
      }

      await onSave(formData);
      onClose();
    } catch (error) {
      toast.error("Failed to create resource");
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = TYPES.map((t) => ({
    value: t,
    label: t.replaceAll("_", " "),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-orange-500/20 bg-inherit px-6 pb-4 pt-6">
          <h2 className="text-lg font-bold text-white">Add Resource</h2>

          <button
            onClick={onClose}
            className="text-zinc-400 transition hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                <FiType size={12} />
                Resource Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                className={`w-full rounded-xl border px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 ${
                  errors.name
                    ? "border-red-500/50 bg-white/5"
                    : "border-orange-500/30 bg-white/5"
                }`}
                placeholder="e.g. Library Floor 2"
              />

              <p className="mt-1 text-[11px] text-zinc-500">
                Only letters, numbers, spaces, hyphens, underscores, dots,
                apostrophes, commas, and parentheses are allowed.
              </p>

              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-orange-400">
                Type <span className="ml-1 text-red-500">*</span>
              </label>

              <CustomDropdown
                value={form.type}
                options={typeOptions}
                onChange={handleTypeChange}
                placeholder="Select type"
                error={errors.type}
              />

              {errors.type && (
                <p className="mt-1 text-xs text-red-400">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                <FiUsers size={12} />
                Capacity
                {isCapacityRequired && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                disabled={!isCapacityRequired}
                className={`w-full rounded-xl border px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none ${
                  !isCapacityRequired
                    ? "cursor-not-allowed border-zinc-700 bg-zinc-800/60 text-zinc-500"
                    : errors.capacity
                    ? "border-red-500/50 bg-white/5 focus:border-orange-500"
                    : "border-orange-500/30 bg-white/5 focus:border-orange-500"
                }`}
                placeholder={
                  isCapacityRequired
                    ? "e.g. 40"
                    : "Not applicable for this type"
                }
              />

              <p className="mt-1 text-[11px] text-zinc-500">
                {isCapacityRequired
                  ? "Use capacity for halls, floors, study spaces, canteens, rooms, and labs."
                  : "Capacity is not applicable for equipment items like projectors or cameras."}
              </p>

              {errors.capacity && (
                <p className="mt-1 text-xs text-red-400">{errors.capacity}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                <FiMapPin size={12} />
                Location
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                maxLength={200}
                className={`w-full rounded-xl border px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 ${
                  errors.location
                    ? "border-red-500/50 bg-white/5"
                    : "border-orange-500/30 bg-white/5"
                }`}
                placeholder="e.g. Library Building, Floor 2"
              />

              {errors.location && (
                <p className="mt-1 text-xs text-red-400">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                <FiToggleRight size={12} />
                Status
                <span className="ml-1 text-red-500">*</span>
              </label>

              <CustomDropdown
                value={form.status}
                options={STATUS_OPTIONS}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, status: val }));
                  if (errors.status) {
                    setErrors((prev) => ({ ...prev, status: "" }));
                  }
                }}
                placeholder="Select status"
                error={errors.status}
              />

              {errors.status && (
                <p className="mt-1 text-xs text-red-400">{errors.status}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                <FiImage size={12} />
                Resource Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-orange-500/30 bg-white/5 px-4 py-2 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-orange-500 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-orange-600"
              />

              <p className="mt-1 text-[11px] text-zinc-500">
                Maximum image size: 5MB. Allowed formats: JPG, PNG, GIF, WEBP.
              </p>

              {errors.image && (
                <p className="mt-1 text-xs text-red-400">{errors.image}</p>
              )}

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-3 max-h-40 w-auto rounded-xl border border-orange-500/30 object-cover"
                />
              )}
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 border-t border-orange-500/20 bg-inherit px-6 pb-6 pt-3">
          <div className="flex gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 py-3 font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Resource"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-orange-500/30 bg-white/10 py-3 font-semibold text-white transition-all hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}