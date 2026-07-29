import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import bcrypt from "bcryptjs";

export class TechniciansController {
  async index(request: Request, response: Response) {
    const technicians = await prisma.user.findMany({
      where: { role: "TECHNICIAN" },
      select: {
        id: true,
        name: true,
        email: true,
        availableHours: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return response.json(technicians);
  }

  async create(request: Request, response: Response) {
    const createTechnicianSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      availableHours: z.array(z.string()).min(1),
    });

    const { name, email, password, availableHours } = createTechnicianSchema.parse(
      request.body
    );

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Email is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const technician = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TECHNICIAN",
        availableHours,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        availableHours: true,
      },
    });

    return response.status(201).json(technician);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      availableHours: z.array(z.string()).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, email, password, availableHours } = updateSchema.parse(request.body);

    const technician = await prisma.user.findUnique({
      where: { id },
    });

    if (!technician || technician.role !== "TECHNICIAN") {
      throw new AppError("Technician not found", 404);
    }

    if (email && email !== technician.email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail) {
        throw new AppError("Email is already in use.");
      }
    }

    let hashedPassword = technician.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 8);
    }

    const updatedTechnician = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? technician.name,
        email: email ?? technician.email,
        password: hashedPassword,
        availableHours: availableHours ?? technician.availableHours,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        availableHours: true,
      },
    });

    return response.json(updatedTechnician);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const technician = await prisma.user.findUnique({
      where: { id },
    });

    if (!technician || technician.role !== "TECHNICIAN") {
      throw new AppError("Technician not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return response.status(204).send();
  }
}
