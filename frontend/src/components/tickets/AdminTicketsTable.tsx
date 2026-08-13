import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "../../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus, getMainService } from "../../mocks/tickets";
import { StatusTag } from "../StatusTag";

interface AdminTicketsTableProps {
  tickets: Ticket[];
}

export function AdminTicketsTable({ tickets }: AdminTicketsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-500 rounded-xl shadow-sm flex-1 w-full max-w-full overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed md:table-auto md:min-w-[1200px]">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="w-16 md:w-auto py-3 px-2 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                <span className="md:hidden">Atualiz...</span>
                <span className="hidden md:inline">Atualizado em</span>
              </th>
              <th className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Id</th>
              <th className="py-3 px-2 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Título e Serviço</th>
              <th className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Valor total</th>
              <th className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="hidden lg:table-cell py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Técnico</th>
              <th className="w-10 sm:w-12 md:w-auto py-3 px-1 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider text-center md:text-left">Status</th>
              <th className="w-10 sm:w-12 md:w-auto py-3 px-2 md:py-4 md:px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {tickets.map((ticket) => {
              const mainService = getMainService(ticket);
              const total = ticket.services.reduce((sum, s) => sum + s.price, 0);
              const dateStr = formatDate(ticket.updatedAt);
              const [datePart, timePart] = dateStr.split(" ");
              
              return (
                <tr key={ticket.id} className="hover:bg-gray-600/50 transition-colors">
                  <td className="py-3 px-2 md:py-4 md:px-6 text-sm text-gray-400 whitespace-nowrap">
                    <div className="flex flex-col md:flex-row md:gap-1 text-[10px] md:text-sm">
                      <span>{datePart}</span>
                      <span>{timePart}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 text-sm font-bold text-gray-100">{String(ticket.id).padStart(5, "0")}</td>
                  <td className="py-3 px-2 md:py-4 md:px-6 overflow-hidden">
                    <div className="flex flex-col w-full overflow-hidden pr-2">
                      <span className="text-[12px] md:text-sm font-bold text-gray-100 truncate block w-full">{ticket.title}</span>
                      <span className="text-[10px] text-gray-400 truncate block w-full">{mainService?.name ?? "-"}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 text-sm text-gray-400 whitespace-nowrap">{formatCurrency(total)}</td>
                  <td className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6">
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
                      <span className="text-sm text-gray-400 whitespace-nowrap truncate max-w-[150px]">{ticket.client.name}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell py-3 px-4 md:py-4 md:px-6">
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
                  <td className="py-3 px-1 md:px-6">
                    <div className="flex items-center justify-center md:justify-start">
                      <div className="md:hidden">
                        <StatusTag status={mapStatus(ticket.status)} iconOnly />
                      </div>
                      <div className="hidden md:block">
                        <StatusTag status={mapStatus(ticket.status)} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 md:py-4 md:px-6 text-right">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                      className="p-1.5 md:p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors"
                    >
                      <Pencil size={14} className="md:w-4 md:h-4" />
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