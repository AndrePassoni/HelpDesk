import { useEffect, useState } from "react";
import { Plus, Pencil, Ban, CircleCheck, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { EditServiceModal } from "../components/EditServiceModal";
import { NewServiceModal } from "../components/NewServiceModal";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Erro ao carregar serviços:", err))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggleActive(service: Service) {
    setTogglingId(service.id);
    try {
      if (service.isActive) {
        await api.delete(`/services/${service.id}`);
      } else {
        await api.put(`/services/${service.id}`, { isActive: true });
      }
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao atualizar status do serviço");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="flex flex-col w-full h-full pb-8 max-w-full">
      <header className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Serviços</h1>

        <button
          onClick={() => setIsNewServiceOpen(true)}
          className="h-10 bg-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-lg px-4 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Novo
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-base" size={32} />
        </div>
      ) : (
        <div className="bg-white border border-gray-500 rounded-xl shadow-sm flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="border-b border-gray-500">
                  <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-600/50 transition-colors">
                    <td className="py-3 px-4 md:py-4 md:px-6 text-sm font-normal text-gray-100 whitespace-nowrap">
                      {service.name}
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-sm text-gray-100 whitespace-nowrap">
                      {formatCurrency(service.price)}
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <div className="flex items-center justify-end">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mr-6 ${
                            service.isActive
                              ? "bg-feedback-done/15 text-feedback-done"
                              : "bg-feedback-danger/15 text-feedback-danger"
                          }`}
                        >
                          {service.isActive ? "Ativo" : "Inativo"}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleActive(service)}
                            disabled={togglingId === service.id}
                            className="flex items-center gap-1.5 text-sm font-normal text-gray-300 hover:text-gray-100 transition-colors whitespace-nowrap disabled:opacity-50"
                          >
                            {togglingId === service.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : service.isActive ? (
                              <Ban size={16} />
                            ) : (
                              <CircleCheck size={16} />
                            )}
                            {service.isActive ? "Desativar" : "Reativar"}
                          </button>
                          <button
                            onClick={() => setEditingService(service)}
                            className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-sm text-gray-400">
                      Nenhum serviço cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditServiceModal
        isOpen={editingService !== null}
        service={editingService}
        onClose={() => setEditingService(null)}
        onSaved={(updated) => {
          setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        }}
      />

      <NewServiceModal
        isOpen={isNewServiceOpen}
        onClose={() => setIsNewServiceOpen(false)}
        onCreated={(created) => {
          setServices((prev) => [...prev, created]);
        }}
      />
    </div>
  );
}
