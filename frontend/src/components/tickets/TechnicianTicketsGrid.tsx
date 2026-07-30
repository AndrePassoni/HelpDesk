import { Pencil, Clock, CheckCircle } from "lucide-react";
import type { TicketMock, TicketStatus } from "../../mocks/tickets";
import { StatusTag } from "../StatusTag";

interface TechnicianTicketsGridProps {
  tickets: TicketMock[];
}

// Helper to group tickets
function groupTicketsByStatus(tickets: TicketMock[]) {
  const groups: Record<string, TicketMock[]> = {
    progress: [],
    open: [],
    done: [],
    danger: [],
  };
  
  tickets.forEach(t => {
    if (groups[t.status]) {
      groups[t.status].push(t);
    }
  });

  return groups;
}

export function TechnicianTicketsGrid({ tickets }: TechnicianTicketsGridProps) {
  const grouped = groupTicketsByStatus(tickets);

  // Statuses to display in order
  const displayOrder: TicketStatus[] = ["progress", "open", "done"];

  return (
    <div className="flex flex-col gap-10">
      {displayOrder.map(status => {
        const groupTickets = grouped[status];
        if (groupTickets.length === 0) return null;

        return (
          <div key={status} className="flex flex-col gap-4">
            {/* Status Header */}
            <div>
              <StatusTag status={status} />
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupTickets.map(ticket => (
                <div key={ticket.id} className="bg-white border border-gray-500 rounded-xl p-5 shadow-sm flex flex-col hover:border-brand-base transition-colors">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-400">{ticket.id}</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors">
                        <Pencil size={16} />
                      </button>
                      
                      {status === "open" && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-white rounded-lg text-xs font-bold transition-colors">
                          <Clock size={14} />
                          Iniciar
                        </button>
                      )}
                      
                      {status === "progress" && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-white rounded-lg text-xs font-bold transition-colors">
                          <CheckCircle size={14} />
                          Encerrar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-100 line-clamp-1">{ticket.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{ticket.service}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-500 my-4" />

                  {/* Card Footer 1 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400">{ticket.updatedAt}</span>
                    <span className="text-sm font-bold text-gray-100">{ticket.totalValue}</span>
                  </div>

                  {/* Card Footer 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0">
                        {ticket.customerInitials}
                      </div>
                      <span className="text-xs font-bold text-gray-100 whitespace-nowrap">{ticket.customerName}</span>
                    </div>
                    
                    {/* Status Icon/Badge mapping (using existing StatusTag or custom icon) */}
                    <div>
                      {status === "open" && <div className="w-5 h-5 rounded-full bg-feedback-open/10 flex items-center justify-center text-feedback-open"><Clock size={12} /></div>}
                      {status === "progress" && <div className="w-5 h-5 rounded-full bg-feedback-progress/10 flex items-center justify-center text-feedback-progress"><Clock size={12} /></div>}
                      {status === "done" && <div className="w-5 h-5 rounded-full bg-feedback-done/10 flex items-center justify-center text-feedback-done"><CheckCircle size={12} /></div>}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
