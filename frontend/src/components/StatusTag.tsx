import { Clock, HelpCircle, CheckCircle2 } from "lucide-react";

interface StatusTagProps {
  status: "open" | "progress" | "done";
  label?: string;
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
    icon: Clock,
    fontWeight: "font-bold",
  },
  done: {
    bg: "bg-[#508B2633]",
    text: "text-[#508B26FF]",
    defaultLabel: "Encerrado",
    icon: CheckCircle2,
    fontWeight: "font-bold",
  },
};

export function StatusTag({ status, label }: StatusTagProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs ${config.fontWeight} ${config.bg} ${config.text}`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="leading-[1.4]">{label || config.defaultLabel}</span>
    </span>
  );
}