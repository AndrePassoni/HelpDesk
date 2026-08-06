import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Clock2, CircleCheckBig, Plus, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { Ticket, Service } from "../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus } from "../mocks/tickets";
import { StatusTag } from "../components/StatusTag";
import { AddServicesModal } from "../components/AddServicesModal";

const statusConfigMap = {
  open: { bg: "bg-[#CC3D6A33]", text: "text-[#CC3D6AFF]", label: "Aberto", icon: AlertCircle },
  progress: { bg: "bg-[#355EC533]", text: "text-[#355EC5FF]", label: "Em atendimento", icon: Clock2 },
  done: { bg: "bg-[#508B2633]", text: "text-[#508B26FF]", label: "Encerrado", icon: CircleCheckBig },
};

export function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Ticket["services"]>([]);
  const [isAddServicesOpen, setIsAddServicesOpen] = useState(false);

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then((res) => {
        setTicket(res.data);
        setServices(res.data.services);
      })
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [id]);

  const uiStatus = ticket ? mapStatus(ticket.status) : "open";
  const statusCfg = statusConfigMap[uiStatus];
  const StatusIcon = statusCfg.icon;
  const isTechnician = user?.role === "TECHNICIAN";

  const mainService = services[0];
  const additionalServices = services.slice(1);
  const basePrice = mainService?.price ?? 0;
  const additionalTotal = additionalServices.reduce((s, svc) => s + svc.price, 0);
  const total = services.reduce((s, svc) => s + svc.price, 0);

  async function handleUpdateStatus(newStatus: "IN_PROGRESS" | "CLOSED") {
    if (!ticket) return;
    setSaving(true);
    try {
      await api.put(`/tickets/${id}`, { status: newStatus });
      setTicket((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      alert("Erro ao atualizar status");
    } finally {
      setSaving(false);
    }
  }

  function handleRemoveService(serviceId: string) {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  }

  function handleAddServices(newServices: Service[]) {
    setServices((prev) => [...prev, ...newServices]);
  }

  const existingServiceIds = services.map((s) => s.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-base" size={32} />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-gray-400">Chamado não encontrado.</p>
        <button onClick={() => navigate("/")} className="text-sm font-bold text-brand-base hover:underline">
          Voltar para chamados
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-600 p-6 md:p-12">
      <div className="w-full max-w-200 mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-4 flex-1">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-xs font-normal text-gray-300 hover:text-gray-100 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Voltar</span>
            </button>
            <h1 className="text-2xl font-bold text-brand-dark">Chamado detalhado</h1>
          </div>
          {isTechnician && (
            <div className="flex items-center gap-3">
              {ticket.status !== "CLOSED" && (
                <button
                  onClick={() => handleUpdateStatus("CLOSED")}
                  disabled={saving}
                  className="h-10 bg-gray-500 hover:bg-gray-400 text-gray-200 font-bold text-sm rounded-[5px] px-4 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CircleCheckBig size={18} />
                  Encerrar
                </button>
              )}
              {ticket.status === "OPEN" && (
                <button
                  onClick={() => handleUpdateStatus("IN_PROGRESS")}
                  disabled={saving}
                  className="h-10 bg-gray-200 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-[5px] px-4 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Clock2 size={18} />
                  Iniciar atendimento
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content - 3 columns side by side */}
        <div className="flex gap-6 w-full">
          {/* Left Column - Ticket Info (480px fixed) */}
          <div className="w-120 shrink-0 flex flex-col gap-3">
            <div className="border border-gray-500 rounded-[10px] p-6 flex flex-col gap-5">
              {/* ID + Status + Title */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-normal text-gray-300">
                    {String(ticket.id).padStart(5, "0")}
                  </span>
                  <StatusTag status={uiStatus} />
                </div>
                <span className="text-base font-normal text-gray-200">{ticket.title}</span>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-normal text-gray-400">Descrição</span>
                <span className="text-sm font-normal text-gray-200">{ticket.description}</span>
              </div>

              {/* Category */}
              {mainService && (
                <div className="flex flex-col gap-1 h-9.75 justify-center">
                  <span className="text-xs font-normal text-gray-400">Categoria</span>
                  <span className="text-sm font-normal text-gray-200">{mainService.name}</span>
                </div>
              )}

              {/* Dates */}
              <div className="flex gap-8">
                <div className="flex flex-col gap-1 flex-1 justify-center">
                  <span className="text-xs font-normal text-gray-400">Criado em</span>
                  <span className="text-xs font-normal text-gray-200">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1 flex-1 justify-center">
                  <span className="text-xs font-normal text-gray-400">Atualizado em</span>
                  <span className="text-xs font-normal text-gray-200">{formatDate(ticket.updatedAt)}</span>
                </div>
              </div>

              {/* Client */}
              <div className="flex flex-col gap-2 justify-center">
                <span className="text-xs font-normal text-gray-400">Cliente</span>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0 relative overflow-hidden">
                    {ticket.client.imageUrl ? (
                      <img
                        src={`http://localhost:3333/files/${ticket.client.imageUrl}`}
                        alt={ticket.client.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(ticket.client.name)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-normal text-gray-200">{ticket.client.name}</span>
                    <span className="text-xs font-normal text-gray-300">{ticket.client.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Services Box */}
            <div className="border border-gray-500 rounded-[10px] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-normal text-gray-400">Serviços adicionais</span>
                <button
                  onClick={() => setIsAddServicesOpen(true)}
                  className="w-7 h-7 bg-gray-200 hover:bg-gray-100 rounded-[5px] flex items-center justify-center transition-colors"
                >
                  <Plus size={14} className="text-gray-600" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {additionalServices.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-500">
                    <span className="text-sm font-normal text-gray-200 flex-1">{svc.name}</span>
                    <span className="text-sm font-normal text-gray-200 text-right w-24">
                      {formatCurrency(svc.price)}
                    </span>
                    <button
                      onClick={() => handleRemoveService(svc.id)}
                      className="w-7 h-7 bg-gray-500 hover:bg-gray-400 rounded-[5px] flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={14} className="text-gray-200" />
                    </button>
                  </div>
                ))}
                {additionalServices.length === 0 && (
                  <div className="py-4 text-center text-gray-400 text-sm">
                    Nenhum serviço adicional
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Technician + Pricing (fill remaining space) */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="border border-gray-500 rounded-[10px] p-6 flex flex-col gap-8 flex-1">
              {/* Technician */}
              <div className="flex flex-col gap-2 justify-center">
                <span className="text-xs font-normal text-gray-400">Técnico responsável</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-sm font-bold text-gray-600 uppercase shrink-0 tracking-[1.4px] relative overflow-hidden">
                    {ticket.technician.imageUrl ? (
                      <img
                        src={`http://localhost:3333/files/${ticket.technician.imageUrl}`}
                        alt={ticket.technician.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(ticket.technician.name)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-normal text-gray-200">{ticket.technician.name}</span>
                    <span className="text-xs font-normal text-gray-300">{ticket.technician.email}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-normal text-gray-400">Valores</span>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-normal text-gray-200 flex-1">Preço base</span>
                  <span className="text-sm font-normal text-gray-200 text-right w-24">
                    {formatCurrency(basePrice)}
                  </span>
                </div>

                {additionalServices.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-normal text-gray-400">Adicionais</span>
                    {additionalServices.map((svc) => (
                      <div key={svc.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm font-normal text-gray-200 flex-1">{svc.name}</span>
                        <span className="text-sm font-normal text-gray-200 text-right w-24">
                          {formatCurrency(svc.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 border-t border-gray-500 pt-3">
                  <span className="text-base font-normal text-gray-200 flex-1">Total</span>
                  <span className="text-base font-normal text-gray-200 text-right w-24">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddServicesModal
        isOpen={isAddServicesOpen}
        onClose={() => setIsAddServicesOpen(false)}
        onAddServices={handleAddServices}
        existingServiceIds={existingServiceIds}
      />
    </div>
  );
}