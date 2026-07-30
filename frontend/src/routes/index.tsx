import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { NewTicket } from "../pages/NewTicket";
import { DashboardLayout } from "../layouts/DashboardLayout";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {isAuthenticated ? (
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-ticket" element={<NewTicket />} />
          <Route path="/technicians" element={<Dashboard />} />
          <Route path="/customers" element={<Dashboard />} />
          <Route path="/services" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}
