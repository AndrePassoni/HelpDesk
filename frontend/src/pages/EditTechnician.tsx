import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { api } from "../services/api";
import { getInitials } from "../mocks/tickets";
import { PERIODS } from "../utils/technicianHours";

interface Technician {
  id: string;
  name: string;
  email: string;
  availableHours: string[];
  imageUrl?: string | null;
}

export function EditTechnician() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const stateTechnician = (location.state as { technician?: Technician } | null)?.technician;

  const [technician, setTechnician] = useState<Technician | null>(stateTechnician ?? null);
  const [loading, setLoading] = useState(!stateTechnician);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(stateTechnician?.name ?? "");
  const [email, setEmail] = useState(stateTechnician?.email ?? "");
  const [availableHours, setAvailableHours] = useState<string[]>(stateTechnician?.availableHours ?? []);

  useEffect(() => {
    if (stateTechnician) return;

    api
      .get("/technicians")
      .then((res) => {
        const found = (res.data as Technician[]).find((t) => t.id === id) ?? null;
        setTechnician(found);
        if (found) {
          setName(found.name);
          setEmail(found.email);
          setAvailableHours(found.availableHours ?? []);
        }
      })
      .catch((err) => console.error("Erro ao carregar técnico:", err))
      .finally(() => setLoading(false));
  }, [id, stateTechnician]);

  function toggleHour(hour: string) {
    setAvailableHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  }

  async function handleSave() {
    if (!technician) return;
    setSaving(true);
    try {
      await api.put(`/technicians/${technician.id}`, {
        name,
        email,
        availableHours: [...availableHours].sort(),
      });
      navigate("/technicians");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar técnico");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-base" size={32} />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-gray-400">Técnico não encontrado.</p>
        <button onClick={() => navigate("/technicians")} className="text-sm font-bold text-brand-base hover:underline">
          Voltar para técnicos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full pb-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col gap-2 md:gap-4 w-full md:w-auto">
          <button
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
            onClick={() => navigate("/technicians")}
            disabled={saving}
            className="flex-1 md:flex-none h-10 bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold text-sm rounded-[5px] md:rounded-lg px-4 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none h-10 bg-gray-100 hover:bg-gray-100/90 text-white font-bold text-sm rounded-[5px] md:rounded-lg px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Salvando..." : "Salvar"}
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

          <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-base font-bold text-gray-600 uppercase shrink-0 relative overflow-hidden">
            {technician.imageUrl ? (
              <img
                src={`http://localhost:3333/files/${technician.imageUrl}`}
                alt={technician.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(technician.name)
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

        {/* Horários de atendimento */}
        <div className="flex-1 min-w-0 border border-gray-500 rounded-[10px] p-4 md:p-6 flex flex-col gap-5 bg-transparent">
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
        </div>
      </div>
    </div>
  );
}
