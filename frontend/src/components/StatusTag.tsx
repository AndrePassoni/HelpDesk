import { Clock2, HelpCircle, CircleCheckBig } from "lucide-react";

interface StatusTagProps {
  status: "open" | "progress" | "done";
  label?: string;
  iconOnly?: boolean;
}

const statusConfig = {
  open: {
    bg: "bg-[#CC3D6A33]",
    text: "text-[#CC3D6AFF]",
    defaultLabel: "Aberto",
    icon: HelpCircle,
    fontWeight: "font-normal",
  },
  progress: {
    bg: "bg-[#355EC533]",
    text: "text-[#4D5ECFFF]",
    defaultLabel: "Em atendimento",
    icon: Clock2,
    fontWeight: "font-bold",
  },
  done: {
    bg: "bg-[#508B2633]",
    text: "text-[#508B26FF]",
    defaultLabel: "Encerrado",
    icon: CircleCheckBig,
    fontWeight: "font-bold",
  },
};

export function StatusTag({ status, label, iconOnly = false }: StatusTagProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (iconOnly) {
    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${config.bg} ${config.text}`}>
        <Icon size={14} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs ${config.fontWeight} ${config.bg} ${config.text}`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="leading-[1.4]">{label || config.defaultLabel}</span>
    </span>
  );
}