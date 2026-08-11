import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import bcrypt from "bcryptjs";

export class UsersController {
  // Rota pública para registro de novos clientes
  async create(request: Request, response: Response) {
    const createUserSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = createUserSchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Email is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return response.status(201).json(user);
  }

  // Listagem de Clientes (Admin)
  async index(request: Request, response: Response) {
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return response.json(clients);
  }

  // Edição de conta de Cliente (Admin)
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, email, password } = updateSchema.parse(request.body);

    const client = await prisma.user.findUnique({
      where: { id },
    });

    if (!client || client.role !== "CLIENT") {
      throw new AppError("Client not found", 404);
    }

    if (email && email !== client.email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail) {
        throw new AppError("Email is already in use.");
      }
    }

    let hashedPassword = client.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 8);
    }

    const updatedClient = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? client.name,
        email: email ?? client.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return response.json(updatedClient);
  }

  // Exclusão de conta de Cliente (Admin) - cascade exclui os Chamados dele (onDelete: Cascade no schema)
  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const client = await prisma.user.findUnique({
      where: { id },
    });

    if (!client || client.role !== "CLIENT") {
      throw new AppError("Client not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return response.status(204).send();
  }
}
