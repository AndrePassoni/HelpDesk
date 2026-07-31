import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import type { Ticket } from "../mocks/tickets";
import { ClientTicketsTable } from "../components/tickets/ClientTicketsTable";
import { AdminTicketsTable } from "../components/tickets/AdminTicketsTable";
import { TechnicianTicketsGrid } from "../components/tickets/TechnicianTicketsGrid";

export function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "CLIENT";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/tickets")
      .then((res) => setTickets(res.data))
      .catch((err) => console.error("Erro ao carregar chamados:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTickets = search
    ? tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.client?.name.toLowerCase().includes(search.toLowerCase())
      )
    : tickets;

  return (
    <div className="flex flex-col w-full h-full pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            {role === "ADMIN" ? "Chamados" : "Meus chamados"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Gerencie e acompanhe todos os chamados abertos.
          </p>
        </div>
      </header>

      {role !== "TECHNICIAN" && (
        <div className="flex items-center bg-white border border-gray-500 rounded-lg p-2 mb-6 shadow-sm w-full max-w-md">
          <Search size={20} className="text-gray-400 mx-2" />
          <input
            type="text"
            placeholder="Buscar chamado por assunto ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-100 placeholder-gray-400"
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-base" size={32} />
        </div>
      ) : (
        <>
          {role === "CLIENT" && <ClientTicketsTable tickets={filteredTickets} />}
          {role === "ADMIN" && <AdminTicketsTable tickets={filteredTickets} />}
          {role === "TECHNICIAN" && (
            <div className="mt-4">
              <TechnicianTicketsGrid tickets={filteredTickets} />
            </div>
          )}
        </>
      )}
    </div>
  );
}