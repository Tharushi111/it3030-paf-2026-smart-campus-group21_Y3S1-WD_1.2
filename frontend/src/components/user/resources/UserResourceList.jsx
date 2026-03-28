import UserResourceCard from "./UserResourceCard";

export default function UserResourceList({ resources, loading }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white px-4 py-14 text-center text-slate-500 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
          <p className="text-sm tracking-wide">Loading campus resources...</p>
        </div>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white px-4 py-14 text-center text-slate-500 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-slate-700">
            No Resources Found
          </p>
          <p className="text-sm text-slate-500">
            Try adjusting filters or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <UserResourceCard
          key={resource.id}
          resource={resource}
        />
      ))}
    </div>
  );
}