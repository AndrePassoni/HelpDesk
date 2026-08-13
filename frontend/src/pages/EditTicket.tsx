import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Clock2, CircleCheckBig, Plus, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { Ticket, Service } from "../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus } from "../mocks/tickets";
import { StatusTag } from "../components/StatusTag";
import { AddServicesModal } from "../components/AddServicesModal";

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
  const isTechnician = user?.role === "TECHNICIAN";
  const isAdmin = user?.role === "ADMIN";

  // O serviço base é a categoria original do chamado (baseServiceId), não o primeiro item do array
  const mainService = services.find((s) => s.id === ticket?.baseServiceId) ?? services[0];
  const additionalServices = services.filter((s) => s.id !== mainService?.id);
  const basePrice = mainService?.price ?? 0;
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
    if (serviceId === ticket?.baseServiceId) return; // segurança: nunca remove o serviço base
    const previous = services;
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    persistServices(updated, previous);
  }

  function handleAddServices(newServices: Service[]) {
    const previous = services;
    const updated = [...services, ...newServices];
    setServices(updated);
    persistServices(updated, previous);
  }

  async function persistServices(updated: Ticket["services"], previous: Ticket["services"]) {
    try {
      await api.put(`/tickets/${id}`, { serviceIds: updated.map((s) => s.id) });
    } catch (err) {
      alert("Erro ao salvar serviços do chamado");
      setServices(previous);
    }
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="flex flex-col gap-2 flex-1">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-[12px] font-bold text-gray-200 hover:text-gray-100 transition-colors w-fit"
            >
              <ArrowLeft size={14} />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-brand-base">Chamado detalhado</h1>
          </div>
          {isTechnician && (
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              {ticket.status !== "CLOSED" && (
                <button
                  onClick={() => handleUpdateStatus("CLOSED")}
                  disabled={saving}
                  className="flex-1 md:flex-none h-10 bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold text-sm rounded-[5px] px-2 md:px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CircleCheckBig size={16} />
                  Encerrar
                </button>
              )}
              {ticket.status === "OPEN" && (
                <button
                  onClick={() => handleUpdateStatus("IN_PROGRESS")}
                  disabled={saving}
                  className="flex-1 md:flex-none h-10 bg-gray-100 hover:bg-gray-200 text-white font-bold text-sm rounded-[5px] px-2 md:px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Clock2 size={16} />
                  <span className="truncate">Iniciar atendimento</span>
                </button>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={() => handleUpdateStatus("IN_PROGRESS")}
                disabled={saving || ticket.status === "IN_PROGRESS"}
                className="flex-1 md:flex-none h-10 bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold text-sm rounded-[5px] px-2 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Clock2 size={16} />
                <span className="truncate">Em atendimento</span>
              </button>
              <button
                onClick={() => handleUpdateStatus("CLOSED")}
                disabled={saving || ticket.status === "CLOSED"}
                className="flex-1 md:flex-none h-10 bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold text-sm rounded-[5px] px-2 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <CircleCheckBig size={16} />
                Encerrado
              </button>
            </div>
          )}
        </div>

        {/* Content - Responsive Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-[480px_1fr] gap-4 md:gap-6 items-start">
          
          {/* Ticket Info Box */}
          <div className="order-1 md:col-start-1 md:row-start-1 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-5 bg-transparent">
            {/* ID + Status + Title */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-normal text-gray-200">
                  {String(ticket.id).padStart(5, "0")}
                </span>
                <StatusTag status={uiStatus} />
              </div>
              <span className="text-base font-bold text-gray-100">{ticket.title}</span>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[10px] font-bold uppercase text-gray-400">Descrição</span>
              <span className="text-sm font-normal text-gray-200 leading-relaxed">{ticket.description}</span>
            </div>

            {/* Category */}
            {mainService && (
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Categoria</span>
                <span className="text-sm font-normal text-gray-200">{mainService.name}</span>
              </div>
            )}

            {/* Dates */}
            <div className="flex gap-4 mt-1">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Criado em</span>
                <span className="text-[12px] font-normal text-gray-200">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Atualizado em</span>
                <span className="text-[12px] font-normal text-gray-200">{formatDate(ticket.updatedAt)}</span>
              </div>
            </div>

            {/* Client */}
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase text-gray-400">Cliente</span>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0 relative overflow-hidden">
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
                  <span className="text-[12px] font-normal text-gray-100">{ticket.client.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technician + Pricing Box */}
          <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-8 bg-transparent">
            {/* Technician */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase text-gray-400">Técnico responsável</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-[12px] font-bold text-gray-600 uppercase shrink-0 tracking-[1px] relative overflow-hidden">
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
                  <span className="text-[12px] font-normal text-gray-300">{ticket.technician.email}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase text-gray-400">Valores</span>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-normal text-gray-100 flex-1">Preço base</span>
                <span className="text-[12px] font-normal text-gray-100 text-right w-24">
                  {formatCurrency(basePrice)}
                </span>
              </div>

              {additionalServices.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Adicionais</span>
                  {additionalServices.map((svc) => (
                    <div key={svc.id} className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-normal text-gray-200 flex-1">{svc.name}</span>
                      <span className="text-[12px] font-normal text-gray-200 text-right w-24">
                        {formatCurrency(svc.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 border-t border-gray-500 pt-4 mt-2">
                <span className="text-sm font-bold text-gray-100 flex-1">Total</span>
                <span className="text-sm font-bold text-gray-100 text-right w-24">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Services Box */}
          {isTechnician && (
            <div className="order-3 md:col-start-1 md:row-start-2 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-4 bg-transparent">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-gray-400">Serviços adicionais</span>
                <button
                  onClick={() => setIsAddServicesOpen(true)}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-[5px] flex items-center justify-center transition-colors"
                >
                  <Plus size={16} className="text-white" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {additionalServices.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between gap-3 py-3 border-b border-gray-500">
                    <span className="text-[12px] font-bold text-gray-200 flex-1">{svc.name}</span>
                    <span className="text-[12px] font-normal text-gray-200 text-right w-20">
                      {formatCurrency(svc.price)}
                    </span>
                    <button
                      onClick={() => handleRemoveService(svc.id)}
                      className="w-7 h-7 bg-gray-500 hover:bg-gray-400 rounded-[5px] flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={14} className="text-feedback-danger" />
                    </button>
                  </div>
                ))}
                {additionalServices.length === 0 && (
                  <div className="py-2 text-center text-[12px] text-gray-400">
                    Nenhum serviço adicional inserido.
                  </div>
                )}
              </div>
            </div>
          )}
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