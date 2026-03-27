import { Link, Outlet } from "react-router-dom";
import { FiHome, FiGrid, FiLogIn } from "react-icons/fi";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-orange-600">
            CampusNexus
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-100 hover:text-orange-700"
            >
              <FiHome />
              Home
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-100 hover:text-orange-700"
            >
              <FiGrid />
              Resources
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <FiLogIn />
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}