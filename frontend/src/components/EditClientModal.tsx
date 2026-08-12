import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { getInitials } from "../mocks/tickets";

interface Client {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
}

interface EditClientModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onSaved: (updated: Client) => void;
}

export function EditClientModal({ isOpen, client, onClose, onSaved }: EditClientModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
    }
  }, [client]);

  if (!isOpen || !client) return null;

  async function handleSave() {
    if (!client) return;
    setSaving(true);
    try {
      const res = await api.put(`/users/${client.id}`, { name, email });
      onSaved({ ...client, ...res.data });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao atualizar cliente");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-110 bg-gray-600 rounded-[10px] border border-gray-500 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5">
          <span className="text-base font-normal text-gray-200">Cliente</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 px-7 pt-7 pb-8 border-t border-gray-500">
          <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-gray-600 font-bold text-lg uppercase shrink-0 relative overflow-hidden">
            {client.imageUrl ? (
              <img
                src={`http://localhost:3333/files/${client.imageUrl}`}
                alt={client.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(client.name)
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                Nome
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
                e-mail
              </label>
              <div className="h-10 border-b border-gray-500 flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-base font-bold text-gray-100 focus:outline-none"
                />
              </div>
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
