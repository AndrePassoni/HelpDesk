import { PencilLine, Clock2, CircleCheckBig } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { Ticket, TicketStatus } from "../../mocks/tickets";
import { getInitials, formatDate, mapStatus, getMainService } from "../../mocks/tickets";
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {groupTickets.map((ticket) => {
                const mainService = getMainService(ticket);
                const total = ticket.services.reduce((sum, s) => sum + s.price, 0);
                return (
                  <div
                    key={ticket.id}
                    className="bg-white border border-gray-500 rounded-xl p-4 md:p-5 shadow-sm flex flex-col hover:border-brand-base transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-400">
                        {String(ticket.id).padStart(5, "0")}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          className="p-1.5 bg-gray-500 hover:bg-gray-400 rounded-[5px] text-gray-200 transition-colors"
                        >
                          <PencilLine size={16} />
                        </button>
                        {status === "OPEN" && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-white rounded-[5px] text-xs font-bold transition-colors"
                          >
                            <Clock2 size={12} />
                            Iniciar
                          </button>
                        )}
                        {status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-white rounded-[5px] text-xs font-bold transition-colors"
                          >
                            <CircleCheckBig size={12} />
                            Encerrar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-base font-bold text-gray-100 line-clamp-1">{ticket.title}</h3>
                      <p className="text-xs font-normal text-gray-300 mt-0.5">{mainService?.name ?? "-"}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] font-normal text-gray-200">{formatDate(ticket.updatedAt)}</span>
                      <span className="text-sm font-bold text-gray-100">
                        <span className="text-[10px] font-bold text-gray-300 mr-1">R$</span>
                        {total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="w-full h-px bg-gray-500 mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
                        <span className="text-[12px] font-bold text-gray-100 whitespace-nowrap">
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