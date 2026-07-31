import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

interface StatusTagProps {
  status: "open" | "progress" | "done" | "danger";
  label?: string;
}

const statusConfig = {
  open: {
    bg: "bg-feedback-open/10",
    text: "text-feedback-open",
    defaultLabel: "Aberto",
    icon: AlertCircle,
  },
  progress: {
    bg: "bg-feedback-progress/10",
    text: "text-feedback-progress",
    defaultLabel: "Em atendimento",
    icon: Clock,
  },
  done: {
    bg: "bg-feedback-done/10",
    text: "text-feedback-done",
    defaultLabel: "Encerrado",
    icon: CheckCircle2,
  },
  danger: {
    bg: "bg-feedback-danger/10",
    text: "text-feedback-danger",
    defaultLabel: "Cancelado",
    icon: AlertCircle,
  },
};

export function StatusTag({ status, label }: StatusTagProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${config.bg} ${config.text}`}
    >
      <Icon size={14} />
      {label || config.defaultLabel}
    </span>
  );
}
