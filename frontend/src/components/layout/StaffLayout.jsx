import { Outlet, NavLink } from "react-router-dom";
import { FiClipboard, FiHome, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function StaffLayout() {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
        : "text-zinc-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#f8f4ee]">
      <header className="sticky top-0 z-40 border-b border-orange-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <h1 className="text-2xl font-bold text-white">CampusNexus Staff</h1>
            <p className="text-sm text-zinc-400">Staff Operations Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-white">{user?.fullName}</p>
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

        <div className="mx-auto flex max-w-7xl gap-3 px-4 pb-4 md:px-8">
          <NavLink to="/staff" end className={navClass}>
            <FiHome />
            Dashboard
          </NavLink>

          <NavLink to="/staff/tickets" className={navClass}>
            <FiClipboard />
            Assigned Tickets
          </NavLink>

          <button
            onClick={logout}
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-orange-200 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 CampusNexus Staff Portal</p>
          <p>Manage assigned maintenance and incident tickets efficiently.</p>
        </div>
      </footer>
    </div>
  );
}