import request from "supertest";
import { app } from "../app";
import { prisma } from "../database/prisma";
import bcrypt from "bcryptjs";

describe("SessionsController", () => {
  beforeAll(async () => {
    // Garantir que não há lixo no banco antes dos testes
    // No mundo real, usaríamos um banco de testes separado
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should be able to authenticate an existing user and get a JWT token", async () => {
    const email = "test_auth@helpdesk.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 8);

    // Cria o usuário de teste diretamente no banco
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        name: "Test Auth User",
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    const response = await request(app).post("/sessions").send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(email);
  });

  it("should not authenticate with wrong password", async () => {
    const response = await request(app).post("/sessions").send({
      email: "test_auth@helpdesk.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
