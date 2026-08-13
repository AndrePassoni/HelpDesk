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
      <div className="w-full max-w-[480px] bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-7 py-4 md:py-5">
          <span className="text-base font-bold md:font-normal text-gray-100 md:text-gray-200">Adicionar serviços</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-4 md:px-7 pt-2 md:pt-0 pb-4 md:pb-7 border-t border-b border-gray-500 flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-brand-base" size={24} />
            </div>
          ) : allServices.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              Nenhum serviço cadastrado
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allServices.map((svc) => {
                const isSelected = selectedIds.includes(svc.id);
                const alreadyAdded = isAlreadyAdded(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    disabled={alreadyAdded}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 md:p-4 rounded-[5px] border transition-colors ${
                      alreadyAdded
                        ? "bg-gray-500/30 border-gray-500 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-brand-base/10 border-brand-base"
                        : "bg-gray-500 hover:bg-gray-400/20 border-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex flex-col flex-1 text-left w-full">
                      <span className="text-sm font-bold text-gray-100">{svc.name}</span>
                      {svc.description && (
                        <span className="text-xs text-gray-400 line-clamp-2 mt-0.5">{svc.description}</span>
                      )}
                      {alreadyAdded && (
                        <span className="text-xs font-bold text-gray-400 mt-1">Já adicionado</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 mt-2 sm:mt-0 border-t sm:border-none border-gray-500 pt-2 sm:pt-0">
                      <span className="text-sm font-bold text-gray-100 whitespace-nowrap">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(svc.price)}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        alreadyAdded
                          ? "bg-gray-400 border-gray-400"
                          : isSelected
                          ? "bg-brand-base border-brand-base"
                          : "border-gray-500 bg-transparent"
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
        <div className="px-4 md:px-7 py-4 md:py-5 flex flex-col md:flex-row items-center justify-end gap-2 md:gap-3 bg-gray-600">
          <button
            onClick={onClose}
            className="w-full md:w-auto h-10 px-4 bg-gray-500 hover:bg-gray-400 text-gray-200 font-bold text-sm rounded-[5px] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0 || loading}
            className="w-full md:w-auto h-10 px-4 bg-brand-base hover:bg-brand-dark text-gray-600 font-bold text-sm rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={14} />
            Adicionar {selectedIds.length} serviço{selectedIds.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}