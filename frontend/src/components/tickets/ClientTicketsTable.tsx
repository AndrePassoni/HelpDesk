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
    <div className="bg-gray-600 rounded-[10px] sm:rounded-[20px] flex-1 min-w-0 border border-gray-500 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider w-24">Atualizado em</th>
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider hidden md:table-cell">Id</th>
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Título</th>
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider hidden md:table-cell">Serviço</th>
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider hidden lg:table-cell">Valor total</th>
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider hidden lg:table-cell">Técnico</th>
              <th className="py-4 px-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider text-center md:text-left">Status</th>
              <th className="py-4 px-4 md:px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {tickets.map((ticket) => {
              const mainService = getMainService(ticket);
              const total = ticket.services.reduce((sum, s) => sum + s.price, 0);
              const [dateStr, timeStr] = formatDate(ticket.updatedAt).split(' ');
              
              return (
                <tr key={ticket.id} className="hover:bg-gray-600/50 transition-colors">
                  <td className="py-4 px-4 md:px-6 text-xs md:text-sm text-gray-400 whitespace-nowrap">
                    <div className="flex flex-col md:flex-row md:gap-1">
                      <span>{dateStr}</span>
                      <span>{timeStr}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm font-bold text-gray-100 hidden md:table-cell">{String(ticket.id).padStart(5, "0")}</td>
                  <td className="py-4 px-4 md:px-6 text-xs md:text-sm text-gray-100 font-bold max-w-[120px] md:max-w-[200px]">
                    <div className="line-clamp-2">{ticket.title}</div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-400 hidden md:table-cell">{mainService?.name ?? "-"}</td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-400 whitespace-nowrap hidden lg:table-cell">{formatCurrency(total)}</td>
                  <td className="py-4 px-4 md:px-6 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-base flex items-center justify-center text-[10px] font-bold text-gray-100 uppercase shrink-0 relative overflow-hidden">
                        {ticket.technician.imageUrl ? (
                          <img src={`http://localhost:3333/files/${ticket.technician.imageUrl}`} alt={ticket.technician.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(ticket.technician.name)
                        )}
                      </div>
                      <span className="text-sm text-gray-400 whitespace-nowrap truncate max-w-[150px]">{ticket.technician.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-center md:text-left">
                    <div className="block md:hidden">
                      <StatusTag status={mapStatus(ticket.status)} iconOnly />
                    </div>
                    <div className="hidden md:block">
                      <StatusTag status={mapStatus(ticket.status)} />
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-right">
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