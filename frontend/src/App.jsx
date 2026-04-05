import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage from "./components/Home.jsx";
import AboutPage from "./components/AboutPage.jsx";
import ContactPage from "./components/ContactPage.jsx";
import LoginPage from "./components/login.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";

import UserDashboard from "./components/user/UserDashboard.jsx";
import UserResourcesPage from "./components/user/resources/UserResourcesPage.jsx";
import MyTicketsPage from "./components/user/tickets/MyTicketsPage.jsx";

import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ResourceManagementPage from "./components/admin/pages/resources/ResourceManagementPage.jsx";
import AdminTicketManagementPage from "./components/admin/pages/tickets/AdminTicketManagementPage.jsx";

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

/* Root Route */
function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-lg font-semibold text-orange-600">
        Loading...
      </div>
    );
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <HomePage />;
}

export default function App() {
  return (
    <Routes>
      {/* User Side */}
      <Route element={<UserLayout />}>
        <Route index element={<RootRoute />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Public resources page */}
        <Route path="resources" element={<UserResourcesPage />} />

        {/* Guest only */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Logged user only */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="tickets" element={<MyTicketsPage />} />
        </Route>

        {/* 404 inside user layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Side */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="resources" element={<ResourceManagementPage />} />
            <Route path="tickets" element={<AdminTicketManagementPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}