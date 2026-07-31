import { Pencil, Clock, CheckCircle } from "lucide-react";
import type { Ticket, TicketStatus } from "../../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus } from "../../mocks/tickets";
import { StatusTag } from "../StatusTag";

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

export function TechnicianTicketsGrid({ tickets }: TechnicianTicketsGridProps) {
  const grouped = groupTicketsByStatus(tickets);
  const displayOrder: TicketStatus[] = ["IN_PROGRESS", "OPEN", "CLOSED"];

  const statusLabels: Record<TicketStatus, string> = {
    OPEN: "Abertos",
    IN_PROGRESS: "Em atendimento",
    CLOSED: "Encerrados",
  };

  return (
    <div className="flex flex-col gap-10">
      {displayOrder.map((status) => {
        const groupTickets = grouped[status];
        if (groupTickets.length === 0) return null;

        return (
          <div key={status} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-100">{statusLabels[status]}</h2>
              <span className="text-xs font-bold text-gray-400 bg-gray-500/30 px-2 py-0.5 rounded-full">
                {groupTickets.length}
              </span>
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
                        <button className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors">
                          <Pencil size={16} />
                        </button>
                        {status === "OPEN" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-white rounded-lg text-xs font-bold transition-colors">
                            <Clock size={14} />
                            Iniciar
                          </button>
                        )}
                        {status === "IN_PROGRESS" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-white rounded-lg text-xs font-bold transition-colors">
                            <CheckCircle size={14} />
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
                        <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0">
                          {getInitials(ticket.client.name)}
                        </div>
                        <span className="text-xs font-bold text-gray-100 whitespace-nowrap">
                          {ticket.client.name}
                        </span>
                      </div>
                      <div>
                        {status === "OPEN" && (
                          <div className="w-5 h-5 rounded-full bg-feedback-open/10 flex items-center justify-center text-feedback-open">
                            <Clock size={12} />
                          </div>
                        )}
                        {status === "IN_PROGRESS" && (
                          <div className="w-5 h-5 rounded-full bg-feedback-progress/10 flex items-center justify-center text-feedback-progress">
                            <Clock size={12} />
                          </div>
                        )}
                        {status === "CLOSED" && (
                          <div className="w-5 h-5 rounded-full bg-feedback-done/10 flex items-center justify-center text-feedback-done">
                            <CheckCircle size={12} />
                          </div>
                        )}
                      </div>
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