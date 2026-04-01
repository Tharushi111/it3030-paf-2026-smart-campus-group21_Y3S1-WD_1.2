import { FiCalendar, FiTrendingUp, FiUsers, FiBookOpen } from "react-icons/fi";

export default function UserDashboard() {
  const stats = [
    { title: "Upcoming Bookings", value: "3", icon: <FiCalendar />, color: "from-blue-500 to-cyan-400" },
    { title: "Active Resources", value: "12", icon: <FiTrendingUp />, color: "from-emerald-500 to-teal-400" },
    { title: "Total Capacity", value: "2,340", icon: <FiUsers />, color: "from-violet-500 to-purple-400" },
    { title: "Resources Used", value: "78", icon: <FiBookOpen />, color: "from-orange-500 to-amber-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section – dark glassmorphic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-xl border border-orange-500/20">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative">
          <h1 className="text-3xl font-bold">Welcome back, Student 👋</h1>
          <p className="mt-2 text-orange-100">
            Explore available resources, make bookings, and manage your schedule.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur p-6 transition-all hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-orange-400">{stat.value}</p>
              </div>
              <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur p-6">
        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-left transition hover:bg-orange-500/20">
            <FiCalendar className="text-orange-400" size={24} />
            <p className="mt-2 font-semibold text-white">Book a Resource</p>
            <p className="text-sm text-gray-400">Schedule a lab or meeting room</p>
          </button>
          <button className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-left transition hover:bg-orange-500/20">
            <FiTrendingUp className="text-orange-400" size={24} />
            <p className="mt-2 font-semibold text-white">View My Bookings</p>
            <p className="text-sm text-gray-400">Check upcoming reservations</p>
          </button>
          <button className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-left transition hover:bg-orange-500/20">
            <FiUsers className="text-orange-400" size={24} />
            <p className="mt-2 font-semibold text-white">Explore Resources</p>
            <p className="text-sm text-gray-400">Browse all available facilities</p>
          </button>
        </div>
      </div>
    </div>
  );
}