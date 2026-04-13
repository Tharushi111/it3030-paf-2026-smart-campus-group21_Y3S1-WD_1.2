import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import {
  FiGrid,
  FiLayers,
  FiUser,
  FiCalendar,
  FiTool,
  FiUsers,
  FiMessageSquare,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../common/NotificationBell";
import logo from "../../assets/Logo.png";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: <FiGrid />,
    color: "from-orange-500 to-amber-400",
  },
  {
    to: "/admin/resources",
    label: "Resources",
    icon: <FiLayers />,
    color: "from-rose-500 to-pink-400",
  },
  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: <FiCalendar />,
    color: "from-emerald-500 to-teal-400",
  },
  {
    to: "/admin/tickets",
    label: "Tickets",
    icon: <FiTool />,
    color: "from-violet-500 to-purple-400",
  },
  {
    to: "/admin/notifications",
    label: "Notifications",
    icon: <FiMessageSquare />,
    color: "from-sky-500 to-cyan-400",
  },
  {
    to: "/admin/users",
    label: "Users & Roles",
    icon: <FiUsers />,
    color: "from-fuchsia-500 to-pink-400",
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!loading && (!user || user.role !== "ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');

        .sidebar-glow {
          box-shadow: 4px 0 40px rgba(251,146,60,0.06);
        }

        .nav-active {
          background: linear-gradient(135deg, rgba(251,146,60,0.18), rgba(251,191,36,0.10));
          border-color: rgba(251,146,60,0.35);
          box-shadow: 0 0 12px rgba(251,146,60,0.2);
        }

        .nav-item {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          transform: translateX(2px);
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.05);
        }

        .pulse-dot {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <aside className="sidebar-glow flex min-h-screen w-[285px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="border-b border-white/[0.06] px-6 py-7">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white/5 shadow-lg shadow-orange-500/20 transition-transform duration-200 group-hover:scale-105">
              <img
                src={logo}
                alt="CampusNexus Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-lg font-bold leading-none text-white"
              >
                CampusNexus
              </h1>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-orange-400">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        <div className="mx-4 my-4 overflow-hidden rounded-2xl border border-orange-500/20 bg-white/[0.02]">
          <nav className="flex-1 space-y-1 px-2 py-3">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400/70">
              Navigation
            </p>

            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/admin" && location.pathname.startsWith(item.to));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-item flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "nav-active border-orange-500/25 text-orange-300"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div
                    className={`nav-icon flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-white shadow-md transition-transform duration-200`}
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  >
                    {item.icon}
                  </div>

                  <span className="flex-1">{item.label}</span>

                  {isActive && (
                    <div className="pulse-dot h-1.5 w-1.5 rounded-full bg-orange-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/[0.06] px-4 py-5">
          {loading ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-3">
              <div className="text-sm text-zinc-400">Loading...</div>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setImageError(false);
                  setShowProfileModal(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-3 text-left transition-all hover:bg-white/[0.06]"
              >
                {user.profileImageUrl && !imageError ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    onError={() => setImageError(true)}
                    className="h-9 w-9 flex-shrink-0 rounded-full border border-orange-400/30 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                    <FiUser size={15} className="text-white" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-200">
                    {user.fullName}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {user.email}
                  </p>
                </div>

                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg"
              >
                <FiLogOut size={14} />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950/80 px-8 backdrop-blur">
          <div>
            <h2 className="text-base font-semibold text-zinc-200">
              Admin Workspace
            </h2>
            <p className="text-xs text-zinc-500">
              Manage resources, bookings, tickets, and users
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <NotificationBell
                user={user}
                preferencesPath="/admin/notifications"
              />
            )}

            <div className="flex items-center gap-2 rounded-xl border border-orange-500/25 bg-gradient-to-r from-orange-500/20 to-amber-400/10 px-3 py-1.5">
              <div className="pulse-dot h-1.5 w-1.5 rounded-full bg-orange-400" />
              <span className="text-xs font-bold tracking-wider text-orange-300">
                {user?.role || "ADMIN"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-8 py-8">
          <Outlet />
        </main>

        <footer className="border-t border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950/60 px-8 py-4 text-center text-xs text-zinc-500 backdrop-blur">
          © 2026 CampusNexus. All rights reserved.
        </footer>
      </div>

      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 shadow-2xl">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 text-zinc-300 transition hover:bg-white/20 hover:text-white"
            >
              <FiX size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              {user.profileImageUrl && !imageError ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.fullName}
                  onError={() => setImageError(true)}
                  className="h-24 w-24 rounded-full border-4 border-orange-400/40 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
                  <FiUser size={36} />
                </div>
              )}

              <h3 className="mt-4 text-xl font-bold text-white">
                {user.fullName}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{user.email}</p>

              <span className="mt-3 rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-1.5 text-xs font-bold tracking-wide text-orange-300">
                {user.role}
              </span>

              <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Profile Details
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500">Full Name</p>
                    <p className="text-sm font-medium text-zinc-200">
                      {user.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="break-all text-sm font-medium text-zinc-200">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Role</p>
                    <p className="text-sm font-medium text-zinc-200">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/admin/notifications"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
              >
                <FiMessageSquare size={15} />
                Notification Preferences
              </Link>

              <button
                onClick={logout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              >
                <FiLogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}