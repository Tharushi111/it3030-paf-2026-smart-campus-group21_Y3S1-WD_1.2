import UserResourceCard from "./UserResourceCard";

export default function UserResourceList({ resources, loading }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-500/30 bg-gradient-to-br from-slate-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur px-4 py-12 text-center text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500/30 border-t-orange-500"></div>
          <p>Loading resources...</p>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-500/30 bg-gradient-to-br from-slate-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur px-4 py-12 text-center text-gray-400">
        <p>No resources found.</p>
        <p className="text-sm">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <UserResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}