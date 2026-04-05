import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiSave,
  FiX,
  FiInfo,
  FiImage,
  FiChevronDown,
  FiChevronUp,
  FiArrowUp,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import { createTicket } from "../../../services/ticketService";

const CATEGORY_OPTIONS = [
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "INCIDENT", label: "Incident" },
  { value: "SOFTWARE", label: "Software" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "NETWORK", label: "Network" },
  { value: "OTHER", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

function RequiredMark() {
  return <span className="ml-1 text-red-500">*</span>;
}

function CustomSelect({
  label,
  name,
  value,
  options,
  onChange,
  error,
  required = false,
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || "Select option";

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <RequiredMark />}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-left text-sm shadow-sm transition ${
          error
            ? "border-red-400 ring-1 ring-red-200"
            : "border-orange-200 hover:border-orange-300"
        }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {selectedLabel}
        </span>
        {open ? (
          <FiChevronUp className="text-orange-500" />
        ) : (
          <FiChevronDown className="text-orange-500" />
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({
                  target: {
                    name,
                    value: option.value,
                  },
                });
                setOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-orange-50 ${
                value === option.value
                  ? "bg-orange-100 font-semibold text-orange-700"
                  : "text-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export default function CreateTicketForm({ onClose, onCreated }) {
  const modalBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "MAINTENANCE",
    priority: "MEDIUM",
    location: "",
    preferredContactName: "",
    preferredContactEmail: "",
    preferredContactPhone: "",
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Ticket title is required.";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    } else if (formData.location.trim().length < 3) {
      newErrors.location = "Location must be at least 3 characters.";
    }

    if (!formData.category) {
      newErrors.category = "Category is required.";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required.";
    }

    if (!formData.preferredContactName.trim()) {
      newErrors.preferredContactName = "Contact name is required.";
    } else if (formData.preferredContactName.trim().length < 3) {
      newErrors.preferredContactName =
        "Contact name must be at least 3 characters.";
    }

    if (!formData.preferredContactEmail.trim()) {
      newErrors.preferredContactEmail = "Contact email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.preferredContactEmail.trim())
    ) {
      newErrors.preferredContactEmail = "Enter a valid email address.";
    }

    if (!formData.preferredContactPhone.trim()) {
      newErrors.preferredContactPhone = "Contact phone is required.";
    } else if (!/^[0-9+\-() ]{7,20}$/.test(formData.preferredContactPhone.trim())) {
      newErrors.preferredContactPhone = "Enter a valid phone number.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 15) {
      newErrors.description = "Description must be at least 15 characters.";
    }

    if (images.length > 3) {
      newErrors.images = "You can upload up to 3 images only.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files || []);

    if (newFiles.length === 0) return;

    const invalidFile = newFiles.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      toast.error("Only image files are allowed.");
      setErrors((prev) => ({
        ...prev,
        images: "Only image files are allowed.",
      }));
      e.target.value = "";
      return;
    }

    const oversizedFile = newFiles.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      toast.error("Each image must be 5MB or less.");
      setErrors((prev) => ({
        ...prev,
        images: "Each image must be 5MB or less.",
      }));
      e.target.value = "";
      return;
    }

    const existingKeys = new Set(
      images.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );

    const uniqueNewFiles = newFiles.filter((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      return !existingKeys.has(key);
    });

    const mergedFiles = [...images, ...uniqueNewFiles];

    if (mergedFiles.length > 3) {
      toast.error("You can upload up to 3 images only.");
      setErrors((prev) => ({
        ...prev,
        images: "You can upload up to 3 images only.",
      }));
      e.target.value = "";
      return;
    }

    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    const nextPreviewUrls = mergedFiles.map((file) => URL.createObjectURL(file));

    setImages(mergedFiles);
    setPreviewUrls(nextPreviewUrls);
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    // allow selecting same file again later if needed
    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const updatedPreviewUrls = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );

    setImages(updatedImages);
    setPreviewUrls(updatedPreviewUrls);
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const handleScroll = () => {
    if (!modalBodyRef.current) return;
    setShowScrollTop(modalBodyRef.current.scrollTop > 180);
  };

  const scrollToTop = () => {
    modalBodyRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the form errors first.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("category", formData.category);
      payload.append("priority", formData.priority);
      payload.append("location", formData.location.trim());
      payload.append("preferredContactName", formData.preferredContactName.trim());
      payload.append(
        "preferredContactEmail",
        formData.preferredContactEmail.trim()
      );
      payload.append(
        "preferredContactPhone",
        formData.preferredContactPhone.trim()
      );

      images.forEach((image) => {
        payload.append("images", image);
      });

      await createTicket(payload);

      toast.success("Ticket created successfully!");

      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error(error?.response?.data?.message || "Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-orange-200 bg-gradient-to-br from-white via-orange-50 to-amber-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-white/90 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <FiInfo size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Report Incident
              </h2>
              <p className="text-sm text-slate-500">
                Submit a maintenance or incident ticket with supporting details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-orange-100 hover:text-orange-500"
          >
            <FiX size={22} />
          </button>
        </div>

        <div
          ref={modalBodyRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto px-6 py-6"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Ticket Title
                  <RequiredMark />
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Projector in Lab A is not turning on"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                    errors.title
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs font-medium text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Location
                  <RequiredMark />
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lab 402, Building A"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                    errors.location
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.location && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.location}
                  </p>
                )}
              </div>

              <CustomSelect
                label="Category"
                name="category"
                value={formData.category}
                options={CATEGORY_OPTIONS}
                onChange={handleChange}
                error={errors.category}
                required
              />

              <CustomSelect
                label="Priority"
                name="priority"
                value={formData.priority}
                options={PRIORITY_OPTIONS}
                onChange={handleChange}
                error={errors.priority}
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Preferred Contact Name
                  <RequiredMark />
                </label>
                <input
                  type="text"
                  name="preferredContactName"
                  value={formData.preferredContactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                    errors.preferredContactName
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.preferredContactName && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.preferredContactName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Preferred Contact Email
                  <RequiredMark />
                </label>
                <input
                  type="email"
                  name="preferredContactEmail"
                  value={formData.preferredContactEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                    errors.preferredContactEmail
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.preferredContactEmail && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.preferredContactEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Preferred Contact Phone
                  <RequiredMark />
                </label>
                <input
                  type="text"
                  name="preferredContactPhone"
                  value={formData.preferredContactPhone}
                  onChange={handleChange}
                  placeholder="0771234567"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                    errors.preferredContactPhone
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.preferredContactPhone && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.preferredContactPhone}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                  <RequiredMark />
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Please describe the issue in detail..."
                  className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                    errors.description
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiImage className="text-orange-500" />
                  Upload Evidence Images
                </label>

                <div className="rounded-2xl border border-dashed border-orange-300 bg-white px-4 py-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-2xl bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-200"
                    >
                      <FiUpload />
                      Choose Images
                    </button>

                    <span className="text-sm text-slate-500">
                      {images.length}/3 image{images.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    You can select up to 3 images total. You may add them one by one or all together.
                  </p>
                </div>

                {errors.images && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.images}
                  </p>
                )}

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm"
                      >
                        <img
                          src={url}
                          alt={`preview-${index}`}
                          className="h-28 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow transition hover:scale-105"
                          title="Remove image"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {showScrollTop && (
              <button
                type="button"
                onClick={scrollToTop}
                className="fixed bottom-10 right-10 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg transition hover:scale-105"
                title="Scroll to top"
              >
                <FiArrowUp size={20} />
              </button>
            )}

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-orange-200 bg-white/90 px-1 pb-1 pt-6 backdrop-blur">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-orange-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                <FiSave size={16} />
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}