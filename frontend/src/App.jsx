import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage from "./components/Home.jsx";
import LoginPage from "./components/login.jsx";
import UserDashboard from "./components/user/UserDashboard.jsx";
import UserResourcesPage from "./components/user/resources/UserResourcesPage.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ResourceManagementPage from "./components/admin/pages/resources/ResourceManagementPage.jsx";
import UserLayout from "./components/layout/UserLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

/* Protected Route */
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-lg font-semibold text-orange-600">
        Loading...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

/* Admin Route */
function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-lg font-semibold text-orange-600">
        Loading...
      </div>
    );
  }

  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/" replace />;
}

/* Public Only Route */
function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-lg font-semibold text-orange-600">
        Loading...
      </div>
    );
  }

  return user ? (
    <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />
  ) : (
    <Outlet />
  );
}

/* Home Route Redirect Logic */
function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-lg font-semibold text-orange-600">
        Loading...
      </div>
    );
  }

  // If admin already logged in, send to admin side
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // Guests and normal users can see normal homepage
  return <HomePage />;
}

export default function App() {
  return (
    <Routes>
      {/* User Side */}
      <Route element={<UserLayout />}>
        <Route index element={<RootRoute />} />

        {/* Public resources page */}
        <Route path="resources" element={<UserResourcesPage />} />

        {/* Login page only for guests */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Normal user protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>
      </Route>

      {/* Admin Side */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="resources" element={<ResourceManagementPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-orange-50 text-3xl font-bold text-orange-500">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}