import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { api } from "../services/api";
import { PERIODS } from "../utils/technicianHours";

const newTechnicianSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 dígitos"),
});

type NewTechnicianForm = z.infer<typeof newTechnicianSchema>;

export function NewTechnician() {
  const navigate = useNavigate();
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [hoursError, setHoursError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewTechnicianForm>({
    resolver: zodResolver(newTechnicianSchema),
  });

  function toggleHour(hour: string) {
    setAvailableHours((prev) => {
      const next = prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour];
      if (next.length > 0) setHoursError(false);
      return next;
    });
  }

  async function handleCreate(data: NewTechnicianForm) {
    if (availableHours.length === 0) {
      setHoursError(true);
      return;
    }

    try {
      await api.post("/technicians", {
        ...data,
        availableHours: [...availableHours].sort(),
      });
      navigate("/technicians");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao criar técnico");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col w-full h-full pb-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col gap-2 md:gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate("/technicians")}
            className="inline-flex items-center gap-2 text-xs font-normal text-gray-300 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-brand-dark">Perfil de técnico</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate("/technicians")}
            disabled={isSubmitting}
            className="flex-1 md:flex-none h-10 bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold text-sm rounded-[5px] md:rounded-lg px-4 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none h-10 bg-gray-100 hover:bg-gray-100/90 text-white font-bold text-sm rounded-[5px] md:rounded-lg px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {/* Dados pessoais */}
        <div className="w-full md:w-[480px] shrink-0 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-5 bg-transparent">
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-gray-100">Dados pessoais</span>
            <span className="text-xs font-normal text-gray-300">
              Defina as informações do perfil de técnico
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                Nome
              </label>
              <div className={`h-10 border-b flex items-center ${errors.name ? "border-feedback-danger" : "border-gray-500"}`}>
                <input
                  type="text"
                  placeholder="Nome completo"
                  {...register("name")}
                  className="w-full bg-transparent text-base font-bold text-gray-100 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
                />
              </div>
              {errors.name && (
                <span className="text-xs font-bold text-feedback-danger mt-1">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                e-mail
              </label>
              <div className={`h-10 border-b flex items-center ${errors.email ? "border-feedback-danger" : "border-gray-500"}`}>
                <input
                  type="email"
                  placeholder="exemplo@mail.com"
                  {...register("email")}
                  className="w-full bg-transparent text-base font-bold text-gray-100 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
                />
              </div>
              {errors.email && (
                <span className="text-xs font-bold text-feedback-danger mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-1">
                Senha
              </label>
              <div className={`h-10 border-b flex items-center ${errors.password ? "border-feedback-danger" : "border-gray-500"}`}>
                <input
                  type="password"
                  placeholder="Defina a senha de acesso"
                  {...register("password")}
                  className="w-full bg-transparent text-base font-bold text-gray-100 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
                />
              </div>
              <span className={`text-xs font-bold mt-1 ${errors.password ? "text-feedback-danger" : "text-gray-400"}`}>
                Mínimo de 6 dígitos
              </span>
            </div>
          </div>
        </div>

        {/* Horários de atendimento */}
        <div className="flex-1 min-w-0 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-gray-100">Horários de atendimento</span>
            <span className="text-xs font-normal text-gray-300">
              Selecione os horários de disponibilidade do técnico para atendimento
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {PERIODS.map((period) => (
              <div key={period.label} className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-300">{period.label}</span>
                <div className="flex flex-wrap gap-2">
                  {period.hours.map((hour) => {
                    const selected = availableHours.includes(hour);
                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => toggleHour(hour)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                          selected
                            ? "bg-brand-base text-gray-600 hover:bg-brand-dark"
                            : "border border-gray-400 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {hour}
                        {selected && <X size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {hoursError && (
            <span className="text-xs font-bold text-feedback-danger">
              Selecione pelo menos um horário de disponibilidade.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
