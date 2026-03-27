// AdminDashboard.jsx
import { Link } from "react-router-dom";
import {
  FiBox,
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiLayers,
  FiCalendar,
  FiActivity,
  FiZap,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Resources",
    value: "48",
    change: "+4 this week",
    icon: <FiBox />,
    gradient: "from-orange-500 to-amber-400",
    bg: "bg-white/5",
    border: "border-orange-500/20",
    text: "text-orange-400",
  },
  {
    title: "Active Resources",
    value: "41",
    change: "85% utilization",
    icon: <FiCheckCircle />,
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-white/5",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  {
    title: "Total Capacity",
    value: "2,340",
    change: "Across all facilities",
    icon: <FiUsers />,
    gradient: "from-violet-500 to-purple-400",
    bg: "bg-white/5",
    border: "border-violet-500/20",
    text: "text-violet-400",
  },
  {
    title: "Booking Rate",
    value: "73%",
    change: "+12% vs last month",
    icon: <FiTrendingUp />,
    gradient: "from-rose-500 to-pink-400",
    bg: "bg-white/5",
    border: "border-rose-500/20",
    text: "text-rose-400",
  },
];

const quickActions = [
  {
    title: "Resource Management",
    desc: "Add, edit, or remove campus facilities and equipment",
    icon: <FiLayers size={22} />,
    to: "/admin/resources",
    gradient: "from-orange-500 to-amber-400",
    bg: "bg-white/5",
    hover: "hover:border-orange-500/40 hover:shadow-orange-500/10",
  },
  {
    title: "Bookings Calendar",
    desc: "View and manage all resource bookings by date",
    icon: <FiCalendar size={22} />,
    to: "/admin/bookings",
    gradient: "from-violet-500 to-purple-400",
    bg: "bg-white/5",
    hover: "hover:border-violet-500/40 hover:shadow-violet-500/10",
  },
  {
    title: "Activity Logs",
    desc: "Monitor admin actions and system events in real time",
    icon: <FiActivity size={22} />,
    to: "/admin/logs",
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-white/5",
    hover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
        .stat-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .stat-card:hover { transform: translateY(-4px); }
        .action-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .action-card:hover { transform: translateY(-3px); }
        .fade-in { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden fade-in" style={{ animationDelay: "0ms" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative px-8 py-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-widest text-white mb-4">
              <FiZap size={11} />
              CampusNexus Admin
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-4xl font-bold text-white leading-tight">
              Welcome back, Admin 👋
            </h1>
            <p className="mt-2 text-orange-100 text-sm max-w-md">
              Everything looks great. Your campus resources are running smoothly with a 73% booking rate this month.
            </p>
          </div>
          <div className="hidden lg:flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <FiCheckCircle size={32} className="text-white" />
            </div>
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mt-6">
              <FiTrendingUp size={32} className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div
            key={s.title}
            className={`stat-card rounded-2xl border ${s.border} ${s.bg} p-5 shadow-xl ${s.glow} fade-in`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg`}>
                {s.icon}
              </div>
              <span className="text-[11px] font-semibold text-zinc-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className={`text-sm font-medium mt-1 ${s.text}`}>{s.title}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xl font-bold text-white">
              Quick Actions
            </h2>
            <p className="text-sm text-orange-400 mt-0.5">Jump to any module instantly</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={action.title}
              to={action.to}
              className={`action-card group rounded-2xl border border-white/[0.08] ${action.bg} p-6 shadow-lg hover:shadow-2xl ${action.hover} hover:border-white/[0.14] fade-in`}
              style={{ animationDelay: `${380 + i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-orange-300 transition-colors">{action.title}</h3>
              <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{action.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-zinc-500 group-hover:text-orange-400 transition-colors">
                Open module <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Status strip */}
      <section className="fade-in rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 flex flex-wrap gap-4 items-center" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #34d399" }} />
          <span className="text-sm text-zinc-400">System <span className="text-emerald-400 font-semibold">Online</span></span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-sm text-zinc-500">Active sessions: <span className="text-zinc-300 font-semibold">12</span></span>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-sm text-zinc-500">Last backup: <span className="text-zinc-300 font-semibold">2 hours ago</span></span>
        <div className="ml-auto text-xs text-zinc-600 font-mono">v2.4.1</div>
      </section>
    </div>
  );
}