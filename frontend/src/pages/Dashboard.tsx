import { Plus, Search } from "lucide-react";
import { StatusTag } from "../components/StatusTag";

// Mock data para visualização inicial
const mockTickets = [
  {
    id: "1024",
    subject: "Problema ao acessar o email corporativo",
    customer: "João Silva",
    date: "24 Out 2026",
    status: "open" as const,
  },
  {
    id: "1023",
    subject: "Notebook não liga",
    customer: "Maria Souza",
    date: "23 Out 2026",
    status: "progress" as const,
  },
  {
    id: "1022",
    subject: "Instalação de software de edição",
    customer: "Carlos Mendes",
    date: "21 Out 2026",
    status: "done" as const,
  },
  {
    id: "1021",
    subject: "Troca de mouse com defeito",
    customer: "Ana Paula",
    date: "20 Out 2026",
    status: "danger" as const,
  },
];

export function Dashboard() {
  return (
    <div className="flex flex-col w-full h-full">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Chamados</h1>
          <p className="text-sm text-gray-400 mt-1">Gerencie e acompanhe todos os chamados abertos.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-white font-bold py-2.5 px-4 rounded-lg transition-colors whitespace-nowrap w-fit">
          <Plus size={20} />
          <span>Novo Chamado</span>
        </button>
      </header>

      {/* Toolbar / Search (Optional for now) */}
      <div className="flex items-center bg-white border border-gray-500 rounded-lg p-2 mb-6 shadow-sm w-full max-w-md">
        <Search size={20} className="text-gray-400 mx-2" />
        <input 
          type="text" 
          placeholder="Buscar chamado por assunto ou cliente..." 
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Table Content */}
      <div className="bg-white border border-gray-500 rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-600 border-b border-gray-500">
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-wider">Assunto</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-wider">Data</th>
                <th className="py-4 px-6 font-bold text-xs text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-600/50 transition-colors cursor-pointer">
                  <td className="py-4 px-6 text-sm font-bold text-gray-300">#{ticket.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-100 font-bold">{ticket.subject}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{ticket.customer}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{ticket.date}</td>
                  <td className="py-4 px-6">
                    <StatusTag status={ticket.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
