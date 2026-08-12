import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";
import { NewTicket } from "../pages/NewTicket";
import { TicketDetail } from "../pages/TicketDetail";
import { EditTicket } from "../pages/EditTicket";
import { Technicians } from "../pages/Technicians";
import { EditTechnician } from "../pages/EditTechnician";
import { NewTechnician } from "../pages/NewTechnician";
import { Customers } from "../pages/Customers";
import { Services } from "../pages/Services";
import { DashboardLayout } from "../layouts/DashboardLayout";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {isAuthenticated ? (
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-ticket" element={<NewTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/tickets/:id/edit" element={<EditTicket />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/technicians/new" element={<NewTechnician />} />
          <Route path="/technicians/:id/edit" element={<EditTechnician />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}
