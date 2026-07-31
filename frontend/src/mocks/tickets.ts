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
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  client: {
    name: string;
    email: string;
  };
  technician: {
    name: string;
    email: string;
  };
  services: Service[];
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