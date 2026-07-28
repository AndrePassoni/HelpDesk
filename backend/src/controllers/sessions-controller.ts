import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { compare } from "bcryptjs";
import { authConfig } from "../configs/auth";
import { sign } from "jsonwebtoken";
import { z } from "zod";

export class SessionsController {
  async create(request: Request, response: Response) {
    const createSessionSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = createSessionSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn: String(expiresIn) as any,
    });

    // Removendo a senha da resposta por segurança
    const { password: _, ...userWithoutPassword } = user;

    return response.json({
      user: userWithoutPassword,
      token,
    });
  }
}
