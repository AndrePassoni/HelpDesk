import { Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { mockTicketsData } from "../mocks/tickets";
import { ClientTicketsTable } from "../components/tickets/ClientTicketsTable";
import { AdminTicketsTable } from "../components/tickets/AdminTicketsTable";
import { TechnicianTicketsGrid } from "../components/tickets/TechnicianTicketsGrid";

export function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "CLIENT";

  return (
    <div className="flex flex-col w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            {role === "ADMIN" ? "Chamados" : "Meus chamados"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">Gerencie e acompanhe todos os chamados abertos.</p>
        </div>
      </header>

      {/* Toolbar / Search */}
      {role !== "TECHNICIAN" && (
        <div className="flex items-center bg-white border border-gray-500 rounded-lg p-2 mb-6 shadow-sm w-full max-w-md">
          <Search size={20} className="text-gray-400 mx-2" />
          <input 
            type="text" 
            placeholder="Buscar chamado por assunto ou cliente..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-100 placeholder-gray-400"
          />
        </div>
      )}

      {/* Content Rendering based on Role */}
      {role === "CLIENT" && <ClientTicketsTable tickets={mockTicketsData} />}
      {role === "ADMIN" && <AdminTicketsTable tickets={mockTicketsData} />}
      {role === "TECHNICIAN" && (
        <div className="mt-4">
          <TechnicianTicketsGrid tickets={mockTicketsData} />
        </div>
      )}

    </div>
  );
}
