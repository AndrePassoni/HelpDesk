import request from "supertest";
import { app } from "../app";
import { prisma } from "../database/prisma";

describe("UsersController", () => {
  afterAll(async () => {
    // Limpar o usuário criado no teste
    await prisma.user.deleteMany({
      where: { email: "new_client@helpdesk.com" },
    });
    await prisma.$disconnect();
  });

  it("should be able to register a new client", async () => {
    const response = await request(app).post("/users").send({
      name: "New Client",
      email: "new_client@helpdesk.com",
      password: "secure_password",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.role).toBe("CLIENT");
    expect(response.body.email).toBe("new_client@helpdesk.com");
  });

  it("should not register a client with an existing email", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicated Client",
      email: "new_client@helpdesk.com",
      password: "secure_password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is already in use.");
  });
});
