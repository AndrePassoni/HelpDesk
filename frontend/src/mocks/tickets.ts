export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  clientId: string;
  technicianId: string;
  baseServiceId: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  client: {
    name: string;
    email: string;
    imageUrl?: string | null;
  };
  technician: {
    name: string;
    email: string;
    imageUrl?: string | null;
  };
  services: Service[];
}

// O serviço "base" é a categoria escolhida na criação do chamado (não pode ser removida pelo Técnico).
// Usar sempre essa função em vez de `services[0]`, que não tem ordem garantida.
export function getMainService(ticket: Ticket): Service | undefined {
  return ticket.services.find((s) => s.id === ticket.baseServiceId) ?? ticket.services[0];
}

export function getAdditionalServices(ticket: Ticket): Service[] {
  const mainService = getMainService(ticket);
  return ticket.services.filter((s) => s.id !== mainService?.id);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapStatus(status: TicketStatus): "open" | "progress" | "done" {
  if (status === "OPEN") return "open";
  if (status === "IN_PROGRESS") return "progress";
  return "done";
}