import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";

export class ServicesController {
  async index(request: Request, response: Response) {
    const isAdmin = request.user?.role === "ADMIN";

    const services = await prisma.service.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    return response.json(services);
  }

  async create(request: Request, response: Response) {
    const createServiceSchema = z.object({
      name: z.string().min(2),
      description: z.string().optional(),
      price: z.number().min(0),
    });

    const { name, description, price } = createServiceSchema.parse(request.body);

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
      },
    });

    return response.status(201).json(service);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().optional(),
      price: z.number().min(0).optional(),
      isActive: z.boolean().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, description, price, isActive } = updateSchema.parse(request.body);

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: name ?? service.name,
        description: description ?? service.description,
        price: price ?? service.price,
        isActive: isActive ?? service.isActive,
      },
    });

    return response.json(updatedService);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    // Soft delete
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return response.status(204).send();
  }
}
