import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { getInitials } from "../mocks/tickets";

interface Technician {
  id: string;
  name: string;
  email: string;
  availableHours: string[];
  imageUrl?: string | null;
}

const VISIBLE_HOURS = 4;

export function Technicians() {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/technicians")
      .then((res) => setTechnicians(res.data))
      .catch((err) => console.error("Erro ao carregar técnicos:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col w-full h-full pb-8 max-w-full">
      <header className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Técnicos</h1>

        <button
          onClick={() => navigate("/technicians/new")}
          className="w-10 h-10 md:w-auto bg-gray-100 md:bg-gray-200 hover:bg-gray-100/90 md:hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-lg px-0 md:px-4 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} className="text-white md:text-gray-600" />
          <span className="hidden md:block text-gray-600">Novo</span>
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-base" size={32} />
        </div>
      ) : (
        <div className="bg-white border border-gray-500 rounded-xl shadow-sm flex-1 w-full max-w-full overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed md:table-auto md:min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-500">
                  <th className="w-auto md:w-auto py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="w-auto md:w-auto py-3 px-2 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                    Disponibilidade
                  </th>
                  <th className="w-10 sm:w-12 md:w-auto py-3 px-2 md:py-4 md:px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500">
                {technicians.map((tech) => {
                  const hours = [...(tech.availableHours ?? [])].sort();
                  const visibleHours = hours.length > 5 ? hours.slice(0, VISIBLE_HOURS) : hours;
                  const remaining = hours.length - visibleHours.length;

                  return (
                    <tr key={tech.id} className="hover:bg-gray-600/50 transition-colors">
                      <td className="py-3 px-4 md:py-4 md:px-6 overflow-hidden">
                        <div className="flex items-center gap-2 w-full pr-2">
                          <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0 relative overflow-hidden">
                            {tech.imageUrl ? (
                              <img
                                src={`http://localhost:3333/files/${tech.imageUrl}`}
                                alt={tech.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(tech.name)
                            )}
                          </div>
                          <span className="text-[12px] md:text-sm font-bold text-gray-100 truncate block">{tech.name}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-3 px-4 md:py-4 md:px-6 text-sm text-gray-400 whitespace-nowrap">
                        {tech.email}
                      </td>
                      <td className="py-3 px-2 md:py-4 md:px-6">
                        {/* Mobile view */}
                        <div className="flex md:hidden flex-wrap items-center gap-1 sm:gap-2">
                          {hours.slice(0, 1).map((hour) => (
                            <span
                              key={hour}
                              className="border border-gray-400 rounded-full px-2 py-1 text-[10px] text-gray-300 whitespace-nowrap"
                            >
                              {hour}
                            </span>
                          ))}
                          {hours.length > 1 && (
                            <span className="border border-gray-400 rounded-full px-2 py-1 text-[10px] text-gray-300 whitespace-nowrap">
                              +{hours.length - 1}
                            </span>
                          )}
                        </div>
                        {/* Desktop view */}
                        <div className="hidden md:flex flex-wrap items-center gap-2">
                          {visibleHours.map((hour) => (
                            <span
                              key={hour}
                              className="border border-gray-400 rounded-full px-3 py-1 text-xs text-gray-300 whitespace-nowrap"
                            >
                              {hour}
                            </span>
                          ))}
                          {remaining > 0 && (
                            <span className="bg-gray-500 rounded-full px-3 py-1 text-xs font-bold text-gray-300 whitespace-nowrap">
                              +{remaining}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 md:py-4 md:px-6 text-right">
                        <button
                          onClick={() => navigate(`/technicians/${tech.id}/edit`, { state: { technician: tech } })}
                          className="p-1.5 md:p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors"
                        >
                          <Pencil size={14} className="md:w-4 md:h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {technicians.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                      Nenhum técnico cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
