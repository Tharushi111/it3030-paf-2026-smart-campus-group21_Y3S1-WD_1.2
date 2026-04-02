import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import HomePage from "./components/Home.jsx";
import LoginPage from "./components/login.jsx";
import UserDashboard from "./components/user/UserDashboard.jsx";
import UserResourcesPage from "./components/user/resources/UserResourcesPage.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ResourceManagementPage from "./components/admin/pages/resources/ResourceManagementPage.jsx";
import UserLayout from "./components/layout/UserLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

// temporary guards
function ProtectedRoute() {
  const isLoggedIn = true;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const isAdmin = true;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public / User Side */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/resources" element={<UserResourcesPage />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="flex min-h-[60vh] items-center justify-center text-3xl font-bold text-orange-100">
              404 - Page Not Found
            </div>
          }
        />
      </Route>

      {/* Admin Side */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="resources" element={<ResourceManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
}