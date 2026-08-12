import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "../../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus, getMainService } from "../../mocks/tickets";
import { StatusTag } from "../StatusTag";

interface ClientTicketsTableProps {
  tickets: Ticket[];
}

export function ClientTicketsTable({ tickets }: ClientTicketsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-500 rounded-xl shadow-sm flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Atualizado em</th>
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Id</th>
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Título</th>
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider hidden md:table-cell">Serviço</th>
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Valor total</th>
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Técnico</th>
              <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 md:py-4 md:px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {tickets.map((ticket) => {
              const mainService = getMainService(ticket);
              const total = ticket.services.reduce((sum, s) => sum + s.price, 0);
              return (
                <tr key={ticket.id} className="hover:bg-gray-600/50 transition-colors">
                  <td className="py-3 px-4 md:py-4 md:px-6 text-sm text-gray-400 whitespace-nowrap">{formatDate(ticket.updatedAt)}</td>
                  <td className="py-3 px-4 md:py-4 md:px-6 text-sm font-bold text-gray-100">{String(ticket.id).padStart(5, "0")}</td>
                  <td className="py-3 px-4 md:py-4 md:px-6 text-sm text-gray-100 font-bold max-w-[200px] truncate">{ticket.title}</td>
                  <td className="py-3 px-4 md:py-4 md:px-6 text-sm text-gray-400 hidden md:table-cell">{mainService?.name ?? "-"}</td>
                  <td className="py-3 px-4 md:py-4 md:px-6 text-sm text-gray-400 whitespace-nowrap">{formatCurrency(total)}</td>
                  <td className="py-3 px-4 md:py-4 md:px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-base flex items-center justify-center text-[10px] font-bold text-gray-100 uppercase shrink-0 relative overflow-hidden">
                        {ticket.technician.imageUrl ? (
                          <img
                            src={`http://localhost:3333/files/${ticket.technician.imageUrl}`}
                            alt={ticket.technician.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(ticket.technician.name)
                        )}
                      </div>
                      <span className="text-sm text-gray-400 whitespace-nowrap truncate max-w-[150px]">{ticket.technician.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 md:py-4 md:px-6">
                    <StatusTag status={mapStatus(ticket.status)} />
                  </td>
                  <td className="py-3 px-4 md:py-4 md:px-6 text-right">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}