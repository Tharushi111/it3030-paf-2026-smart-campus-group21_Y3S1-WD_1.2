// AdminLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiLayers,
  FiSettings,
  FiBell,
  FiUser,
  FiZap,
  FiHeart,
} from "react-icons/fi";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid />, color: "from-orange-500 to-amber-400" },
  { to: "/admin/resources", label: "Resources", icon: <FiLayers />, color: "from-rose-500 to-pink-400" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        .sidebar-glow { box-shadow: 4px 0 40px rgba(251,146,60,0.06); }
        .nav-active { background: linear-gradient(135deg, rgba(251,146,60,0.18), rgba(251,191,36,0.10)); border-color: rgba(251,146,60,0.35); }
        .nav-item { transition: all 0.2s; }
        .nav-item:hover { background: rgba(255,255,255,0.05); }
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>

      {/* Sidebar */}
      <aside className="w-[270px] min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 border-r border-white/[0.06] sidebar-glow flex flex-col flex-shrink-0">
        <div className="px-6 py-7 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FiZap className="text-white" size={18} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg font-bold text-white leading-none">
                CampusNexus
              </h1>
              <p className="text-[11px] text-orange-400 mt-0.5 font-medium tracking-wider uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation area with visible outline */}
        <div className="mx-4 my-4 rounded-2xl border border-orange-500/20 bg-white/[0.02] overflow-hidden">
          <nav className="flex-1 px-2 py-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400/70 px-3 mb-3">Navigation</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-item flex items-center gap-3 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                    isActive
                      ? "nav-active text-orange-300 border-orange-500/25"
                      : "text-zinc-400 border-transparent hover:text-zinc-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md flex-shrink-0`} style={{ opacity: isActive ? 1 : 0.6 }}>
                    {item.icon}
                  </div>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 pulse-dot" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-4 py-5 border-t border-white/[0.06] mt-auto">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <FiUser size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-200 truncate">Admin User</p>
              <p className="text-[11px] text-zinc-500">Super Admin</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950/80 backdrop-blur border-b border-orange-500/20 px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div>
            <h2 className="text-base font-semibold text-zinc-200">Admin Workspace</h2>
            <p className="text-xs text-zinc-500">Manage campus resources & modules</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
              <FiSettings size={15} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all relative">
              <FiBell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-400/10 border border-orange-500/25">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full pulse-dot" />
              <span className="text-xs font-bold text-orange-300 tracking-wider">ADMIN</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8 overflow-auto">
          <Outlet />
        </main>

        {/* Simple Footer with centered text */}
        <footer className="border-t border-orange-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950/60 backdrop-blur px-8 py-4 text-center text-xs text-zinc-500">
          <div className="flex items-center justify-center gap-2">
            <span>© 2024 CampusNexus. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}