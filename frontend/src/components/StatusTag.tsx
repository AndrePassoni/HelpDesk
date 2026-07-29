interface StatusTagProps {
  status: "open" | "progress" | "done" | "danger";
  label?: string;
}

const statusConfig = {
  open: {
    bg: "bg-feedback-open/10",
    text: "text-feedback-open",
    defaultLabel: "Aberto",
  },
  progress: {
    bg: "bg-feedback-progress/10",
    text: "text-feedback-progress",
    defaultLabel: "Em Andamento",
  },
  done: {
    bg: "bg-feedback-done/10",
    text: "text-feedback-done",
    defaultLabel: "Concluído",
  },
  danger: {
    bg: "bg-feedback-danger/10",
    text: "text-feedback-danger",
    defaultLabel: "Cancelado",
  },
};

export function StatusTag({ status, label }: StatusTagProps) {
  const config = statusConfig[status];

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.text}`}
    >
      {label || config.defaultLabel}
    </span>
  );
}
