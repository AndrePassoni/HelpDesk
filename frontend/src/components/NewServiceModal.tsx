import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "../services/api";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
}

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (created: Service) => void;
}

export function NewServiceModal({ isOpen, onClose, onCreated }: NewServiceModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  if (!isOpen) return null;

  function handleClose() {
    setName("");
    setPrice("");
    setErrors({});
    onClose();
  }

  async function handleSave() {
    const trimmedName = name.trim();
    const numericPrice = Number(price.replace(/\./g, "").replace(",", "."));

    const nextErrors: { name?: string; price?: string } = {};
    if (!trimmedName) nextErrors.name = "Informe o título do serviço.";
    if (!price.trim() || Number.isNaN(numericPrice) || numericPrice < 0) {
      nextErrors.price = "Informe um valor válido.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await api.post("/services", { name: trimmedName, price: numericPrice });
      onCreated(res.data);
      handleClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao criar serviço");
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
            onClick={handleClose}
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
            <div className={`h-10 border-b flex items-center ${errors.name ? "border-feedback-danger" : "border-gray-500"}`}>
              <input
                type="text"
                placeholder="Nome do serviço"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className="w-full bg-transparent text-base font-bold text-gray-100 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
              />
            </div>
            {errors.name && (
              <span className="text-xs font-bold text-feedback-danger mt-1">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
              Valor
            </label>
            <div className={`h-10 border-b flex items-center gap-1.5 ${errors.price ? "border-feedback-danger" : "border-gray-500"}`}>
              <span className="text-base font-bold text-gray-100">R$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="00,00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                className="w-full bg-transparent text-base font-bold text-gray-100 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
              />
            </div>
            {errors.price && (
              <span className="text-xs font-bold text-feedback-danger mt-1">{errors.price}</span>
            )}
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
