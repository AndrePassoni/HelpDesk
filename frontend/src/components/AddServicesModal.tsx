import { useState, useEffect } from "react";
import { X, Check, Loader2, Plus } from "lucide-react";
import { api } from "../services/api";
import type { Service } from "../mocks/tickets";

interface AddServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServices: (services: Service[]) => void;
  existingServiceIds: string[];
}

export function AddServicesModal({ isOpen, onClose, onAddServices, existingServiceIds }: AddServicesModalProps) {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadServices();
      setSelectedIds([]);
    }
  }, [isOpen]);

  async function loadServices() {
    setLoading(true);
    try {
      const res = await api.get("/services");
      setAllServices(res.data);
    } catch (err) {
      alert("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  // Mostra todos os serviços; os já adicionados ficam desabilitados
  const isAlreadyAdded = (id: string) => existingServiceIds.includes(id);

  function toggleService(id: string) {
    if (isAlreadyAdded(id)) return;
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function handleConfirm() {
    const servicesToAdd = allServices.filter((s) => selectedIds.includes(s.id) && !isAlreadyAdded(s.id));
    onAddServices(servicesToAdd);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[480px] bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <span className="text-base font-normal text-gray-200">Adicionar serviços</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-7 pt-0 pb-7 border-t border-b border-gray-500">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-brand-base" size={24} />
            </div>
          ) : allServices.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Nenhum serviço cadastrado
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {allServices.map((svc) => {
                const isSelected = selectedIds.includes(svc.id);
                const alreadyAdded = isAlreadyAdded(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    disabled={alreadyAdded}
                    className={`flex items-center justify-between gap-4 p-3 rounded-[5px] border transition-colors ${
                      alreadyAdded
                        ? "bg-gray-500/30 border-gray-500 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-brand-base/10 border-brand-base"
                        : "bg-gray-500 hover:bg-gray-400/20 border-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex flex-col flex-1 text-left">
                      <span className="text-sm font-bold text-gray-100">{svc.name}</span>
                      {svc.description && (
                        <span className="text-xs text-gray-400 line-clamp-1">{svc.description}</span>
                      )}
                      {alreadyAdded && (
                        <span className="text-xs text-gray-500 mt-1">Já adicionado</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-100 whitespace-nowrap">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(svc.price)}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        alreadyAdded
                          ? "bg-gray-400 border-gray-400"
                          : isSelected
                          ? "bg-brand-base border-brand-base"
                          : "border-gray-500"
                      }`}>
                        {alreadyAdded && <Check size={12} className="text-gray-600" />}
                        {isSelected && !alreadyAdded && <Check size={12} className="text-gray-600" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex items-center justify-end gap-3 border-t border-gray-500">
          <button
            onClick={onClose}
            className="h-10 px-4 bg-gray-500 hover:bg-gray-400 text-gray-200 font-bold text-sm rounded-[5px] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0 || loading}
            className="h-10 px-4 bg-brand-base hover:bg-brand-dark text-gray-600 font-bold text-sm rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={14} />
            Adicionar {selectedIds.length} serviço{selectedIds.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}