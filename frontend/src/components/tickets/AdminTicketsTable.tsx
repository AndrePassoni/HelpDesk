import { Pencil } from "lucide-react";
import type { TicketMock } from "../../mocks/tickets";
import { StatusTag } from "../StatusTag";

interface AdminTicketsTableProps {
  tickets: TicketMock[];
}

export function AdminTicketsTable({ tickets }: AdminTicketsTableProps) {
  return (
    <div className="bg-white border border-gray-500 rounded-xl overflow-hidden shadow-sm flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Atualizado em</th>
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Id</th>
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Título e Serviço</th>
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Valor total</th>
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Técnico</th>
              <th className="py-4 px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-600/50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-400">{ticket.updatedAt}</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-100">{ticket.id}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-100">{ticket.title}</span>
                    <span className="text-[10px] text-gray-400">{ticket.service}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-400">{ticket.totalValue}</td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0">
                      {ticket.customerInitials}
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{ticket.customerName}</span>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-base flex items-center justify-center text-[10px] font-bold text-gray-100 uppercase shrink-0">
                      {ticket.technicianInitials}
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{ticket.technicianName}</span>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <StatusTag status={ticket.status} />
                </td>
                
                <td className="py-4 px-6 text-right">
                  <button className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
