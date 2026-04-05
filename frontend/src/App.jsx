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

import StaffLayout from "./components/layout/StaffLayout.jsx";
import StaffDashboard from "./components/staff/StaffDashboard.jsx";
import AssignedTicketsPage from "./components/staff/tickets/AssignedTicketsPage.jsx";

import UserLayout from "./components/layout/UserLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

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

function StaffRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-lg font-semibold text-orange-600">
        Loading...
      </div>
    );
  }

  return user?.role === "STAFF" ? <Outlet /> : <Navigate to="/" replace />;
}

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
    <Navigate
      to={
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "STAFF"
          ? "/staff"
          : "/dashboard"
      }
      replace
    />
  ) : (
    <Outlet />
  );
}

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

  if (user?.role === "STAFF") {
    return <Navigate to="/staff" replace />;
  }

  return <HomePage />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<RootRoute />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="resources" element={<UserResourcesPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="tickets" element={<MyTicketsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="resources" element={<ResourceManagementPage />} />
            <Route path="tickets" element={<AdminTicketManagementPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<StaffRoute />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="tickets" element={<AssignedTicketsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}