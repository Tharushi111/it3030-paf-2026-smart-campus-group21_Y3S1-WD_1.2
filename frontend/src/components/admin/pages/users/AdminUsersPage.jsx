import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiUserPlus,
  FiRefreshCw,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiUser,
  FiMail,
  FiUpload,
  FiImage,
  FiChevronDown,
} from "react-icons/fi";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../../services/adminUserService";

const API_BASE = "http://localhost:9090";

const emptyForm = {
  fullName: "",
  email: "",
  role: "USER",
  active: true,
  profileImage: null,
};

function RequiredMark() {
  return <span className="ml-1 text-red-500">*</span>;
}

function getImageSrc(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_BASE}${imagePath}`;
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function StatCard({ title, value, subtitle, icon, gradient, border }) {
  return (
    <div
      className={`rounded-2xl border ${border} bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 shadow-xl transition-all hover:-translate-y-[2px]`}
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

function CustomRoleDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-3 text-sm text-white outline-none transition ${
          open ? "ring-2 ring-orange-500/20" : ""
        }`}
      >
        <span>{value}</span>
        <FiChevronDown
          className={`text-orange-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-xl">
          {options.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onChange(role);
                setOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm transition ${
                value === role
                  ? "bg-orange-500/20 font-semibold text-orange-300"
                  : "text-zinc-300 hover:bg-orange-500/10 hover:text-orange-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserAvatar({ user, size = "h-11 w-11", textSize = "text-sm" }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = getImageSrc(user?.profileImageUrl);

  if (imageSrc && !failed) {
    return (
      <img
        src={imageSrc}
        alt={user?.fullName || "User"}
        onError={() => setFailed(true)}
        className={`${size} rounded-full border border-orange-300/30 object-cover object-center shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`flex ${size} items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-amber-400/20 border border-orange-400/20 font-bold text-orange-300 ${textSize}`}
    >
      {getInitials(user?.fullName)}
    </div>
  );
}

function UserFormModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  saving,
  isEdit,
  previewUrl,
  setPreviewUrl,
}) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or less");
      return;
    }

    setForm((prev) => ({
      ...prev,
      profileImage: file,
    }));

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setForm((prev) => ({
      ...prev,
      profileImage: null,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {isEdit ? "Update existing user details" : "Add a new user to the system"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 px-3 py-2 text-zinc-300 transition hover:bg-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-zinc-200">
              Full Name
              <RequiredMark />
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full rounded-xl border border-orange-500/30 bg-white/[0.04] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-zinc-200">
              Email
              <RequiredMark />
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full rounded-xl border border-orange-500/30 bg-white/[0.04] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-200">
              Role
              <RequiredMark />
            </label>
            <CustomRoleDropdown
              value={form.role}
              options={["USER", "ADMIN", "STAFF"]}
              onChange={(role) =>
                setForm((prev) => ({
                  ...prev,
                  role,
                }))
              }
            />
          </div>

          <div className="flex items-end">
            <label className="flex w-full items-center gap-3 rounded-xl border border-orange-500/30 bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-200">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active User
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-zinc-200">
              Profile Image
            </label>

            <div className="rounded-2xl border border-dashed border-orange-500/30 bg-white/[0.03] p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500/15 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/25"
                >
                  <FiUpload size={15} />
                  Upload Image
                </button>

                <span className="text-sm text-zinc-400">
                  Optional. JPG, PNG, WEBP up to 5MB.
                </span>
              </div>

              {previewUrl && (
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-orange-500/20 bg-white/[0.03] p-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-16 w-16 rounded-full border border-orange-400/20 object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Selected image</p>
                    <p className="text-xs text-zinc-400">
                      This image will be used as the profile photo.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              )}

              {!previewUrl && (
                <div className="mt-4 flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-zinc-500">
                  <FiImage className="mr-2" />
                  No image selected
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-zinc-300 transition hover:bg-white/[0.08]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchUsers = async (showToast = false) => {
    try {
      if (users.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await getAllUsers();
      setUsers(response.data || []);

      if (showToast) {
        toast.success("Users refreshed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.role?.toLowerCase().includes(q) ||
        user.provider?.toLowerCase().includes(q)
      );
    });
  }, [users, searchTerm]);

  const openAddModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setPreviewUrl("");
    setShowFormModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "USER",
      active: !!user.active,
      profileImage: null,
    });
    setPreviewUrl(getImageSrc(user.profileImageUrl) || "");
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("fullName", form.fullName.trim());
      payload.append("email", form.email.trim());
      payload.append("role", form.role);
      payload.append("active", form.active);

      if (form.profileImage) {
        payload.append("profileImage", form.profileImage);
      }

      if (editingUser) {
        await updateUser(editingUser.id, payload);
        toast.success("User updated successfully");
      } else {
        await createUser(payload);
        toast.success("User created successfully");
      }

      setShowFormModal(false);
      setEditingUser(null);
      setForm(emptyForm);
      setPreviewUrl("");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const staffCount = users.filter((u) => u.role === "STAFF").length;
  const activeCount = users.filter((u) => u.active).length;

  const getRoleBadge = (role) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300">
          <FiShield size={12} />
          ADMIN
        </span>
      );
    }

    if (role === "STAFF") {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">
          <FiUser size={12} />
          STAFF
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
        <FiUser size={12} />
        USER
      </span>
    );
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              <FiUsers size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              User Management
            </span>
          </div>

          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            System Users
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            View, add, edit, and manage all users in the system.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-3 text-sm font-semibold text-orange-300 shadow-lg transition-all hover:border-orange-400 hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
          >
            <FiUserPlus size={16} />
            Add User
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle="All system users"
          icon={<FiUsers />}
          gradient="from-orange-500 to-amber-400"
          border="border-orange-500/20"
        />
        <StatCard
          title="Admins"
          value={adminCount}
          subtitle="Administrative users"
          icon={<FiShield />}
          gradient="from-rose-500 to-pink-400"
          border="border-rose-500/20"
        />
        <StatCard
          title="Staff"
          value={staffCount}
          subtitle="Support staff members"
          icon={<FiUser />}
          gradient="from-sky-500 to-cyan-400"
          border="border-sky-500/20"
        />
        <StatCard
          title="Active Users"
          value={activeCount}
          subtitle="Enabled accounts"
          icon={<FiCheckCircle />}
          gradient="from-emerald-500 to-teal-400"
          border="border-emerald-500/20"
        />
      </section>

      <section className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 py-4 shadow-md">
        <div className="relative">
          <FiSearch
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search by name, email, role, or provider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-orange-500/30 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
          Showing
          <span className="mx-1 font-semibold text-orange-400">
            {filteredUsers.length}
          </span>
          of
          <span className="mx-1 font-semibold text-orange-400">
            {users.length}
          </span>
          users
        </div>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
            <p className="text-sm text-zinc-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FiUsers size={32} className="mx-auto mb-3 text-zinc-700" />
            <p className="font-semibold text-zinc-400">No users found</p>
            <p className="mt-1 text-sm text-zinc-600">
              Try adjusting your search or add a new user.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-orange-500/20 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Provider
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/[0.05] transition-all hover:bg-orange-500/5"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar user={user} size="h-14 w-14" textSize="text-base" />

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-white">
                          {user.fullName}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                          <FiMail size={13} />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-zinc-200">
                      {user.provider || "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {user.active ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                        <FiCheckCircle size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300">
                        <FiXCircle size={12} />
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2 text-orange-400 transition hover:bg-orange-500/20"
                        title="Edit User"
                      >
                        <FiEdit2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                        title="Delete User"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showFormModal && (
        <UserFormModal
          title={editingUser ? "Edit User" : "Add User"}
          form={form}
          setForm={setForm}
          onClose={() => {
            setShowFormModal(false);
            setEditingUser(null);
            setForm(emptyForm);
            if (previewUrl && previewUrl.startsWith("blob:")) {
              URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl("");
          }}
          onSubmit={handleSubmit}
          saving={saving}
          isEdit={!!editingUser}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
      )}
    </div>
  );
}