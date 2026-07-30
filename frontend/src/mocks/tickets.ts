export type TicketStatus = "open" | "progress" | "done" | "danger";

export interface TicketMock {
  id: string;
  updatedAt: string;
  title: string;
  service: string;
  totalValue: string;
  customerName: string;
  customerInitials: string;
  technicianName: string;
  technicianInitials: string;
  status: TicketStatus;
}

export const mockTicketsData: TicketMock[] = [
  {
    id: "00003",
    updatedAt: "13/04/25 20:56",
    title: "Rede lenta",
    service: "Instalação de Rede",
    totalValue: "R$ 180,00",
    customerName: "André Costa",
    customerInitials: "AC",
    technicianName: "Carlos Silva",
    technicianInitials: "CS",
    status: "open",
  },
  {
    id: "00004",
    updatedAt: "12/04/25 15:20",
    title: "Backup não está funcionando",
    service: "Recuperação de Dados",
    totalValue: "R$ 200,00",
    customerName: "André Costa",
    customerInitials: "AC",
    technicianName: "Carlos Silva",
    technicianInitials: "CS",
    status: "open",
  },
  {
    id: "00001",
    updatedAt: "12/04/25 09:01",
    title: "Computador não liga",
    service: "Manutenção de Hardware",
    totalValue: "R$ 150,00",
    customerName: "Aline Souza",
    customerInitials: "AS",
    technicianName: "Carlos Silva",
    technicianInitials: "CS",
    status: "progress",
  },
  {
    id: "00002",
    updatedAt: "10/04/25 10:15",
    title: "Instalação de software de gestão",
    service: "Suporte de Software",
    totalValue: "R$ 200,00",
    customerName: "Julia Maria",
    customerInitials: "JM",
    technicianName: "Ana Oliveira",
    technicianInitials: "AO",
    status: "done",
  },
  {
    id: "00005",
    updatedAt: "11/04/25 15:16",
    title: "Meu fone não conecta no computador",
    service: "Suporte de Software",
    totalValue: "R$ 80,00",
    customerName: "Suzane Moura",
    customerInitials: "SM",
    technicianName: "Ana Oliveira",
    technicianInitials: "AO",
    status: "done",
  },
];
