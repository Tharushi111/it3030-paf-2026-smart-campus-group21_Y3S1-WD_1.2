import { FiBox, FiCheckCircle, FiUsers } from "react-icons/fi";

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-orange-600">{value}</h3>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-3 text-white shadow-md transition-all group-hover:scale-105">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function UserResourceStats({ resources }) {
  const totalResources = resources.length;
  const activeResources = resources.filter((r) => r.status === "ACTIVE").length;
  const totalCapacity = resources.reduce(
    (sum, r) => sum + Number(r.capacity || 0),
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="Total Resources"
        value={totalResources}
        subtitle="All available facilities and assets"
        icon={<FiBox size={20} />}
      />
      <StatCard
        title="Active Resources"
        value={activeResources}
        subtitle="Currently available for usage"
        icon={<FiCheckCircle size={20} />}
      />
      <StatCard
        title="Total Capacity"
        value={totalCapacity}
        subtitle="Combined seating and usage capacity"
        icon={<FiUsers size={20} />}
      />
    </div>
  );
}