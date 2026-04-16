import { Outlet, NavLink, Link } from "react-router-dom";
import { FiClipboard, FiHome, FiLogOut, FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../common/NotificationBell";

export default function StaffLayout() {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
        : "text-zinc-400 hover:text-orange-300 hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <header className="sticky top-0 z-50 border-b border-orange-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.png"
                alt="CampusNexus Logo"
                className="h-10 w-10 rounded-xl object-cover shadow-md"
              />
              <div>
                <h1 className="text-base font-semibold text-zinc-200">
                  CampusNexus Staff
                </h1>
                <p className="text-xs text-zinc-500">Staff Operations Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <NotificationBell
                  user={user}
                  preferencesPath="/staff/notifications/preferences"
                />
              )}

              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-white">
                  {user?.fullName}
                </p>
                <p className="text-xs text-orange-300">{user?.role}</p>
              </div>

              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.fullName}
                  className="h-11 w-11 rounded-full border border-orange-500/30 object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/20 text-white">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <NavLink to="/staff" end className={navClass}>
              <FiHome size={16} />
              Dashboard
            </NavLink>

            <NavLink to="/staff/tickets" className={navClass}>
              <FiClipboard size={16} />
              Assigned Tickets
            </NavLink>

            <Link
              to="/staff/notifications/preferences"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:text-orange-300 hover:bg-white/5"
            >
              <FiBell size={16} />
              Notification Settings
            </Link>

            <button
              onClick={logout}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
            >
              <FiLogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-orange-200 bg-white/50 py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-500">
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
            <p>© 2026 CampusNexus Staff Portal</p>
            <p>Manage assigned maintenance and incident tickets efficiently.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}