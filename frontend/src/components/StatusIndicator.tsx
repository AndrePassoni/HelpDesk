import { Clock2, HelpCircle, CircleCheckBig } from "lucide-react";

interface StatusIndicatorProps {
  status: "open" | "progress" | "done";
}

const statusConfig = {
  open: {
    bg: "bg-[#CC3D6A33]",
    iconColor: "text-[#CC3D6AFF]",
    icon: HelpCircle,
  },
  progress: {
    bg: "bg-[#355EC533]",
    iconColor: "text-[#355EC5FF]",
    icon: Clock2,
  },
  done: {
    bg: "bg-[#508B2633]",
    iconColor: "text-[#508B26FF]",
    icon: CircleCheckBig,
  },
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`h-7 rounded-full flex items-center justify-center px-1.5 ${config.bg}`}>
      <Icon size={16} className={`${config.iconColor} shrink-0`} />
    </div>
  );
}