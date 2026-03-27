export default function StatCard({ title, value, subtitle, icon }) {
    return (
      <div className="rounded-3xl border border-orange-900/50 bg-stone-950/60 p-5 shadow-xl shadow-black/20 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium text-orange-200/80">{title}</div>
          <div className="text-2xl text-orange-400">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-orange-50">{value}</div>
        <div className="mt-1 text-sm text-stone-400">{subtitle}</div>
      </div>
    )
  }