import request from "supertest";
import { app } from "../app";
import { prisma } from "../database/prisma";
import bcrypt from "bcryptjs";

describe("TicketsController", () => {
  let clientToken = "";
  let techId = "";
  let serviceId = "";
  let ticketId = 0;

  beforeAll(async () => {
    const password = await bcrypt.hash("pass123", 8);

    // Criar serviço
    const service = await prisma.service.create({
      data: {
        name: "Test Service Tickets",
        price: 100.5,
      },
    });
    serviceId = service.id;

    // Criar técnico
    const tech = await prisma.user.upsert({
      where: { email: "tech_test_tickets@helpdesk.com" },
      update: { password },
      create: {
        name: "Tech Ticket Tester",
        email: "tech_test_tickets@helpdesk.com",
        password,
        role: "TECHNICIAN",
      },
    });
    techId = tech.id;

    // Criar cliente
    await prisma.user.upsert({
      where: { email: "client_test_tickets@helpdesk.com" },
      update: { password },
      create: {
        name: "Client Ticket Tester",
        email: "client_test_tickets@helpdesk.com",
        password,
        role: "CLIENT",
      },
    });

    // Autenticar cliente
    const response = await request(app).post("/sessions").send({
      email: "client_test_tickets@helpdesk.com",
      password: "pass123",
    });

    clientToken = response.body.token;
  });

  afterAll(async () => {
    // Limpeza
    await prisma.ticket.deleteMany({
      where: { title: "Test Ticket" },
    });
    await prisma.service.delete({
      where: { id: serviceId }
    });
    await prisma.$disconnect();
  });

  it("should be able to create a new ticket", async () => {
    const response = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        title: "Test Ticket",
        description: "This is a test description",
        technicianId: techId,
        serviceIds: [serviceId],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Ticket");
    
    ticketId = response.body.id;
  });

  it("should list tickets for the authenticated client", async () => {
    const response = await request(app)
      .get("/tickets")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Deve haver pelo menos 1 chamado listado (o que criamos)
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
