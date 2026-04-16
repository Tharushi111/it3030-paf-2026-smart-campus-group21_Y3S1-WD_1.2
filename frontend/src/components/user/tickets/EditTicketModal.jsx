import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiSave,
  FiX,
  FiInfo,
  FiImage,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import { updateTicket } from "../../../services/ticketService";

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

export default function EditTicketModal({ ticket, onClose, onUpdated }) {
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
  const [usingNewImages, setUsingNewImages] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        category: ticket.category || "MAINTENANCE",
        priority: ticket.priority || "MEDIUM",
        location: ticket.location || "",
        preferredContactName: ticket.preferredContactName || "",
        preferredContactEmail: ticket.preferredContactEmail || "",
        preferredContactPhone: ticket.preferredContactPhone || "",
      });

      setImages([]);
      setUsingNewImages(false);
      setPreviewUrls(
        (ticket.imageUrls || []).map((img) =>
          img.startsWith("http") ? img : `http://localhost:9090${img}`
        )
      );
      setErrors({});
    }
  }, [ticket]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
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
      newErrors.preferredContactName = "Preferred contact name is required.";
    }

    if (!formData.preferredContactEmail.trim()) {
      newErrors.preferredContactEmail = "Preferred contact email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.preferredContactEmail.trim())
    ) {
      newErrors.preferredContactEmail = "Enter a valid email address.";
    }

    if (!formData.preferredContactPhone.trim()) {
      newErrors.preferredContactPhone = "Preferred contact phone is required.";
    } else if (
      !/^[0-9+\-() ]{7,20}$/.test(formData.preferredContactPhone.trim())
    ) {
      newErrors.preferredContactPhone = "Enter a valid phone number.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 15) {
      newErrors.description = "Description must be at least 15 characters.";
    }

    if (previewUrls.length > 3) {
      newErrors.images = "Maximum 3 images allowed.";
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
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      toast.error("Only image files are allowed.");
      return;
    }

    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      toast.error("Each image must be 5MB or less.");
      return;
    }

    if (files.length > 3) {
      toast.error("Maximum 3 images allowed.");
      return;
    }

    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setImages(files);
    setPreviewUrls(newPreviewUrls);
    setUsingNewImages(true);
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    const updatedPreviewUrls = previewUrls.filter(
      (_, index) => index !== indexToRemove
    );

    const removedUrl = previewUrls[indexToRemove];
    if (removedUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(removedUrl);
    }

    setPreviewUrls(updatedPreviewUrls);

    if (usingNewImages) {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      setImages(updatedImages);
    }
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
      payload.append("preferredContactEmail", formData.preferredContactEmail.trim());
      payload.append("preferredContactPhone", formData.preferredContactPhone.trim());

      if (usingNewImages) {
        images.forEach((image) => {
          payload.append("images", image);
        });
      }

      await updateTicket(ticket.id, payload);

      toast.success("Ticket updated successfully.");
      onUpdated?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-orange-200 bg-gradient-to-br from-white via-orange-50 to-amber-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-200 bg-white/90 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <FiInfo size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Edit Ticket</h2>
              <p className="text-sm text-slate-500">
                Update your ticket before staff assignment
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

        <div className="overflow-y-auto px-6 py-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Ticket Title
                <RequiredMark />
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                name="location"
                value={formData.location}
                onChange={handleChange}
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
                <RequiredMark />
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                  errors.category
                    ? "border-red-400 ring-1 ring-red-200"
                    : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Priority
                <RequiredMark />
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition ${
                  errors.priority
                    ? "border-red-400 ring-1 ring-red-200"
                    : "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-xs font-medium text-red-500">
                  {errors.priority}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Preferred Contact Name
                <RequiredMark />
              </label>
              <input
                name="preferredContactName"
                value={formData.preferredContactName}
                onChange={handleChange}
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
                name="preferredContactEmail"
                value={formData.preferredContactEmail}
                onChange={handleChange}
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
                name="preferredContactPhone"
                value={formData.preferredContactPhone}
                onChange={handleChange}
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
                rows={5}
                value={formData.description}
                onChange={handleChange}
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
                Replace Evidence Images
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
                    {previewUrls.length}/3 image{previewUrls.length !== 1 ? "s" : ""} selected
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Upload up to 3 images to replace the current evidence.
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
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-orange-200 pt-6 md:col-span-2">
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
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:opacity-50"
              >
                <FiSave size={16} />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}