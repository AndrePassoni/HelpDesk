import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { DiskStorageProvider } from "../providers/DiskStorageProvider";

export class TicketsController {
  async index(request: Request, response: Response) {
    const { role, id: userId } = request.user!;

    let whereClause = {};

    if (role === "CLIENT") {
      whereClause = { clientId: userId };
    } else if (role === "TECHNICIAN") {
      whereClause = { technicianId: userId };
    }
    // Se for ADMIN, o whereClause vazio traz todos os chamados

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        client: {
          select: { name: true, email: true },
        },
        technician: {
          select: { name: true, email: true },
        },
        services: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return response.json(tickets);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { role, id: userId } = request.user!;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        services: true,
      },
    });

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    // Regras de acesso
    if (role === "CLIENT" && ticket.clientId !== userId) {
      throw new AppError("Unauthorized access to this ticket", 403);
    }
    if (role === "TECHNICIAN" && ticket.technicianId !== userId) {
      throw new AppError("Unauthorized access to this ticket", 403);
    }

    return response.json(ticket);
  }

  async create(request: Request, response: Response) {
    const createSchema = z.object({
      title: z.string().min(3),
      description: z.string().min(5),
      technicianId: z.string().uuid(),
    });

    // Como pode vir FormData (por causa dos anexos), usamos .parse
    const { title, description, technicianId } = createSchema.parse(request.body);
    const clientId = request.user!.id;

    // Verificar se o technician existe
    const technician = await prisma.user.findUnique({
      where: { id: technicianId, role: "TECHNICIAN" },
    });

    if (!technician) {
      throw new AppError("Technician not found or invalid role", 404);
    }

    // Upload dos arquivos (se houver)
    const files = request.files as Express.Multer.File[];
    const diskStorage = new DiskStorageProvider();
    const attachments: string[] = [];

    if (files) {
      for (const file of files) {
        const filename = await diskStorage.saveFile(file.filename);
        attachments.push(filename);
      }
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        clientId,
        technicianId,
        attachments,
      },
    });

    return response.status(201).json(ticket);
  }

  async update(request: Request, response: Response) {
    // Permite que Técnicos ou Admins mudem o status e vinculem serviços adicionais
    const { role } = request.user!;

    if (role === "CLIENT") {
      throw new AppError("Clients cannot update tickets", 403);
    }

    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const updateSchema = z.object({
      status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
      serviceIds: z.array(z.string().uuid()).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status, serviceIds } = updateSchema.parse(request.body);

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    if (role === "TECHNICIAN" && ticket.technicianId !== request.user!.id) {
      throw new AppError("You can only update your own assigned tickets", 403);
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status: status ?? ticket.status,
        services: serviceIds
          ? {
            set: serviceIds.map((serviceId) => ({ id: serviceId })),
          }
          : undefined,
      },
      include: {
        services: true,
      },
    });

    return response.json(updatedTicket);
  }
}
