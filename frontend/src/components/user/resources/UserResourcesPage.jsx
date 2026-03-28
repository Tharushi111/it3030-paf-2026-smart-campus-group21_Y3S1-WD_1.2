import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getAllResources } from "../../../services/resourceApi";

import UserResourceFilters from "./UserResourceFilters";
import UserResourceList from "./UserResourceList";
import UserResourceStats from "./UserResourceStats";

export default function UserResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchResources = async () => {
    try {
      setLoading(true);

      const response = await getAllResources();

      setResources(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "ALL" || resource.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" || resource.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [resources, searchTerm, typeFilter, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 p-8 text-white shadow-lg">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.25'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative">
          <h1 className="text-4xl font-bold">Campus Resources</h1>
          <p className="mt-2 text-orange-50">
            Browse available labs, lecture halls, rooms, and equipment across campus.
          </p>
        </div>
      </div>

      {/* <UserResourceStats resources={resources} />*/}

      <UserResourceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <UserResourceList
        resources={filteredResources}
        loading={loading}
      />
    </div>
  );
}