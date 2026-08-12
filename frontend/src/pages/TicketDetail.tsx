import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import type { Ticket } from "../mocks/tickets";
import { getInitials, formatDate, formatCurrency, mapStatus, getMainService, getAdditionalServices } from "../mocks/tickets";

const statusConfigMap = {
  open: { bg: "bg-feedback-open/20", text: "text-feedback-open", label: "Aberto", icon: AlertCircle },
  progress: { bg: "bg-feedback-progress/20", text: "text-feedback-progress", label: "Em atendimento", icon: Clock },
  done: { bg: "bg-feedback-done/20", text: "text-feedback-done", label: "Encerrado", icon: CheckCircle2 },
};

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [id]);

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

  const uiStatus = mapStatus(ticket.status);
  const statusCfg = statusConfigMap[uiStatus];
  const StatusIcon = statusCfg.icon;
  const mainService = getMainService(ticket);
  const additionalServices = getAdditionalServices(ticket);
  const basePrice = mainService?.price ?? 0;
  const additionalTotal = additionalServices.reduce((s, svc) => s + svc.price, 0);
  const total = ticket.services.reduce((s, svc) => s + svc.price, 0);

  return (
    <div className="flex flex-col w-full h-full">
      <header className="mb-4 md:mb-8 w-full max-w-200 mx-auto">
        <div className="flex items-end justify-between gap-4 mb-1">
          <div className="flex flex-col gap-2 md:gap-4 flex-1">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors w-fit"
            >
              <ArrowLeft size={14} />
              <span className="text-xs font-normal">Voltar</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-brand-base">Chamado detalhado</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full max-w-200 mx-auto">
        <div className="w-full lg:w-120 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-normal text-gray-400">
                {String(ticket.id).padStart(5, "0")}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide ${statusCfg.bg} ${statusCfg.text}`}
              >
                <StatusIcon size={14} />
                {statusCfg.label}
              </span>
            </div>
            <span className="text-sm md:text-base font-normal text-gray-100">{ticket.title}</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-normal text-gray-400">Descrição</span>
            <span className="text-xs md:text-sm font-normal text-gray-200">{ticket.description}</span>
          </div>

          {mainService && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-normal text-gray-400">Categoria</span>
              <span className="text-xs md:text-sm font-normal text-gray-200">{mainService.name}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-xs font-normal text-gray-400">Criado em</span>
              <span className="text-xs font-normal text-gray-100">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-xs font-normal text-gray-400">Atualizado em</span>
              <span className="text-xs font-normal text-gray-100">{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-6 md:gap-8 justify-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-normal text-gray-400">Técnico responsável</span>
            <div className="flex items-center gap-2">
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

          <div className="flex flex-col gap-4">
            <span className="text-xs font-normal text-gray-400">Valores</span>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-normal text-gray-200 flex-1">Preco base</span>
              <span className="text-xs font-normal text-gray-200 w-20 text-right">
                {formatCurrency(basePrice)}
              </span>
            </div>

            {additionalTotal > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-normal text-gray-400">Adicionais</span>
                {additionalServices.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs font-normal text-gray-200 flex-1">{svc.name}</span>
                    <span className="text-xs font-normal text-gray-200 text-right w-20">
                      {formatCurrency(svc.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-gray-500 pt-3">
              <span className="text-sm font-normal text-gray-200 flex-1">Total</span>
              <span className="text-sm font-normal text-gray-200 text-right w-20">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}