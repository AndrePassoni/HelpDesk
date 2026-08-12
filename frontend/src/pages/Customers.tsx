import { useEffect, useState } from "react";
import { Trash2, Pencil, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { getInitials } from "../mocks/tickets";
import { EditClientModal } from "../components/EditClientModal";
import { DeleteClientModal } from "../components/DeleteClientModal";

interface Client {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
}

export function Customers() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Erro ao carregar clientes:", err))
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteClient() {
    if (!deletingClient) return;
    setIsDeleting(true);
    try {
      await api.delete(`/users/${deletingClient.id}`);
      setClients((prev) => prev.filter((c) => c.id !== deletingClient.id));
      setDeletingClient(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao excluir cliente");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col w-full h-full pb-8 max-w-full">
      <header className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Clientes</h1>
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
                    Nome
                  </th>
                  <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="py-3 px-4 md:py-4 md:px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-600/50 transition-colors">
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0 relative overflow-hidden">
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
                        <span className="text-sm font-bold text-gray-100 whitespace-nowrap">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-sm text-gray-400 whitespace-nowrap">
                      {client.email}
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDeletingClient(client)}
                          className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-feedback-danger transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setEditingClient(client)}
                          className="p-2 bg-gray-500 hover:bg-gray-400 rounded-lg text-gray-300 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {clients.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-sm text-gray-400">
                      Nenhum cliente cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditClientModal
        isOpen={editingClient !== null}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onSaved={(updated) => {
          setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
      />

      <DeleteClientModal
        isOpen={deletingClient !== null}
        clientName={deletingClient?.name ?? ""}
        deleting={isDeleting}
        onClose={() => setDeletingClient(null)}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
}
