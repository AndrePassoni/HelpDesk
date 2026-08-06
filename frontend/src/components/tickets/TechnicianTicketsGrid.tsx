import { PencilLine, Clock2, CircleCheckBig } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { Ticket, TicketStatus } from "../../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus } from "../../mocks/tickets";
import { StatusTag } from "../StatusTag";
import { StatusIndicator } from "../StatusIndicator";

interface TechnicianTicketsGridProps {
  tickets: Ticket[];
}

function groupTicketsByStatus(tickets: Ticket[]) {
  const groups: Record<string, Ticket[]> = {
    IN_PROGRESS: [],
    OPEN: [],
    CLOSED: [],
  };
  tickets.forEach((t) => {
    if (groups[t.status]) {
      groups[t.status].push(t);
    }
  });
  return groups;
}

const statusLabelMap: Record<TicketStatus, "open" | "progress" | "done"> = {
  OPEN: "open",
  IN_PROGRESS: "progress",
  CLOSED: "done",
};

export function TechnicianTicketsGrid({ tickets }: TechnicianTicketsGridProps) {
  const navigate = useNavigate();
  const grouped = groupTicketsByStatus(tickets);
  const displayOrder: TicketStatus[] = ["IN_PROGRESS", "OPEN", "CLOSED"];

  async function handleUpdateStatus(ticketId: number, newStatus: "IN_PROGRESS" | "CLOSED") {
    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
      // The parent Dashboard will refetch tickets automatically
      window.dispatchEvent(new CustomEvent("tickets-updated"));
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {displayOrder.map((status) => {
        const groupTickets = grouped[status];
        if (groupTickets.length === 0) return null;

        const tagStatus = statusLabelMap[status];

        return (
          <div key={status} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <StatusTag status={tagStatus} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupTickets.map((ticket) => {
                const mainService = ticket.services[0];
                const total = ticket.services.reduce((sum, s) => sum + s.price, 0);
                return (
                  <div
                    key={ticket.id}
                    className="bg-white border border-gray-500 rounded-xl p-5 shadow-sm flex flex-col hover:border-brand-base transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-gray-400">
                        {String(ticket.id).padStart(5, "0")}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors"
                        >
                          <PencilLine size={16} />
                        </button>
                        {status === "OPEN" && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Clock2 size={14} />
                            Iniciar
                          </button>
                        )}
                        {status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-colors"
                          >
                            <CircleCheckBig size={14} />
                            Encerrar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-base font-bold text-gray-100 line-clamp-1">{ticket.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{mainService?.name ?? "-"}</p>
                    </div>

                    <div className="w-full h-px bg-gray-500 my-4" />

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-400">{formatDate(ticket.updatedAt)}</span>
                      <span className="text-sm font-bold text-gray-100">{formatCurrency(total)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0 relative overflow-hidden">
                          {ticket.client.imageUrl ? (
                            <img
                              src={`http://localhost:3333/files/${ticket.client.imageUrl}`}
                              alt={ticket.client.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(ticket.client.name)
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-100 whitespace-nowrap">
                          {ticket.client.name}
                        </span>
                      </div>
                      <StatusIndicator status={mapStatus(ticket.status)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}