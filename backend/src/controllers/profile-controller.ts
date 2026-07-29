import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import bcrypt from "bcryptjs";

export class ProfileController {
  async show(request: Request, response: Response) {
    const userId = request.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
        availableHours: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const userId = request.user!.id;

    const updateProfileSchema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      old_password: z.string().optional(),
      password: z.string().min(6).optional(),
    });

    const { name, email, old_password, password } = updateProfileSchema.parse(
      request.body
    );

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (email && email !== user.email) {
      const userWithUpdatedEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithUpdatedEmail) {
        throw new AppError("Email is already in use.");
      }
    }

    if (password && !old_password) {
      throw new AppError("You need to inform the old password to set a new password");
    }

    if (password && old_password) {
      const checkOldPassword = await bcrypt.compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match");
      }

      user.password = await bcrypt.hash(password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
        password: user.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
      },
    });

    return response.json(updatedUser);
  }
}
