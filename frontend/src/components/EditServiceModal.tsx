import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "../services/api";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
}

interface EditServiceModalProps {
  isOpen: boolean;
  service: Service | null;
  onClose: () => void;
  onSaved: (updated: Service) => void;
}

export function EditServiceModal({ isOpen, service, onClose, onSaved }: EditServiceModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(String(service.price).replace(".", ","));
    }
  }, [service]);

  if (!isOpen || !service) return null;

  async function handleSave() {
    if (!service) return;

    const numericPrice = Number(price.replace(/\./g, "").replace(",", "."));
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      alert("Informe um valor válido.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/services/${service.id}`, { name, price: numericPrice });
      onSaved({ ...service, ...res.data });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao atualizar serviço");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-110 bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <span className="text-base font-normal text-gray-200">Serviço</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-4 px-7 pt-7 pb-8 border-t border-gray-500">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
              Título
            </label>
            <div className="h-10 border-b border-gray-500 flex items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-base font-bold text-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
              Valor
            </label>
            <div className="h-10 border-b border-gray-500 flex items-center gap-1.5">
              <span className="text-base font-bold text-gray-100">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-transparent text-base font-bold text-gray-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-6 flex items-center justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full h-10 bg-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-[5px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
