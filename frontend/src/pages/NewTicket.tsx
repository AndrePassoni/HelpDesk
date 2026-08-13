import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Service } from "../mocks/tickets";
import { formatCurrency } from "../mocks/tickets";

interface Technician {
  id: string;
  name: string;
  email: string;
}

const newTicketSchema = z.object({
  title: z.string().min(3, "O título é obrigatório"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  serviceId: z.string().min(1, "Selecione uma categoria de serviço"),
});

type NewTicketForm = z.infer<typeof newTicketSchema>;

export function NewTicket() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    api.get("/services").then((res) => setServices(res.data));
    api.get("/technicians").then((res) => setTechnicians(res.data));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewTicketForm>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: { title: "", description: "", serviceId: "" },
  });

  const selectedServiceId = watch("serviceId");
  const selectedService = services.find((s) => s.id === selectedServiceId);

  async function handleCreateTicket(data: NewTicketForm) {
    try {
      const defaultTech = technicians.length > 0 ? technicians[0].id : undefined;
      
      await api.post("/tickets", {
        title: data.title,
        description: data.description,
        technicianId: defaultTech,
        serviceIds: [data.serviceId],
      });
      alert("Chamado criado com sucesso!");
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao criar chamado. Tente novamente.";
      alert(message);
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <header className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-brand-base md:text-brand-dark">Novo chamado</h1>
      </header>

      <form
        onSubmit={handleSubmit(handleCreateTicket)}
        className="flex flex-col xl:flex-row gap-4 md:gap-6 w-full max-w-6xl pb-8"
      >
        <div className="flex-1 bg-white border border-gray-500 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-100">Informações</h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Configure os dias e horários em que você está disponível para atender chamados
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Título
              </label>
              <input
                type="text"
                placeholder="Digite um título para o chamado"
                {...register("title")}
                className={`w-full border-b py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-base transition-colors bg-transparent text-sm md:text-base ${errors.title ? "border-feedback-danger" : "border-gray-500"}`}
              />
              {errors.title && (
                <span className="text-feedback-danger text-xs mt-1 block font-bold">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Descrição
              </label>
              <textarea
                placeholder="Descreva o que está acontecendo"
                {...register("description")}
                rows={4}
                className={`w-full border-b py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-base transition-colors bg-transparent resize-none text-sm md:text-base ${errors.description ? "border-feedback-danger" : "border-gray-500"}`}
              />
              {errors.description && (
                <span className="text-feedback-danger text-xs mt-1 block font-bold">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Categoria de serviço
              </label>
              <select
                {...register("serviceId")}
                className={`w-full border-b py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-base transition-colors bg-transparent appearance-none cursor-pointer text-sm md:text-base ${errors.serviceId ? "border-feedback-danger" : "border-gray-500"}`}
              >
                <option value="" disabled className="text-gray-400">
                  Selecione a categoria de atendimento
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id} className="text-gray-100">
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <span className="text-feedback-danger text-xs mt-1 block font-bold">
                  {errors.serviceId.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-80 shrink-0">
          <div className="bg-white border border-gray-500 rounded-xl p-6 md:p-8 shadow-sm h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-100">Resumo</h2>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Valores e detalhes</p>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Categoria de serviço
                </span>
                <span className="text-sm text-gray-100 font-bold">
                  {selectedService ? selectedService.name : "Nenhuma categoria selecionada"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Custo inicial
                </span>
                <span className="text-2xl font-bold text-gray-100">
                  {selectedService ? formatCurrency(selectedService.price) : "R$ 0,00"}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-500">
              <p className="text-xs text-gray-400 mb-6">
                O chamado será automaticamente atribuído a um técnico disponível
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-100 hover:bg-gray-200 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Criando..." : "Criar chamado"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}