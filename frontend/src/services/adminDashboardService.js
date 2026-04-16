import { API } from "../context/AuthContext";

export const getAdminDashboardData = () => API.get("/api/admin/dashboard");