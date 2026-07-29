import request from "supertest";
import { app } from "../app";
import { prisma } from "../database/prisma";
import bcrypt from "bcryptjs";

describe("ServicesController", () => {
  let adminToken = "";

  beforeAll(async () => {
    const password = await bcrypt.hash("admin123", 8);

    const admin = await prisma.user.upsert({
      where: { email: "admin_test_services@helpdesk.com" },
      update: { password },
      create: {
        name: "Admin Tester",
        email: "admin_test_services@helpdesk.com",
        password,
        role: "ADMIN",
      },
    });

    const response = await request(app).post("/sessions").send({
      email: "admin_test_services@helpdesk.com",
      password: "admin123",
    });

    adminToken = response.body.token;
  });

  afterAll(async () => {
    await prisma.service.deleteMany({
      where: { name: "Test Service" },
    });
    await prisma.$disconnect();
  });

  it("should be able to create a new service as ADMIN", async () => {
    const response = await request(app)
      .post("/services")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Service",
        description: "This is a test service",
        price: 150.0,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Service");
  });

  it("should block unauthenticated access", async () => {
    const response = await request(app).post("/services").send({
      name: "Should Fail",
      price: 100,
    });

    expect(response.status).toBe(401); // Falta token
  });
});
