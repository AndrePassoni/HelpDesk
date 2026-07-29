# HelpDesk Backend API

This document provides a comprehensive overview of the HelpDesk Backend architecture, technologies, and setup instructions. It serves as an internal guide to understand how the API is structured.

## 🚀 Tech Stack

The backend is built with a robust, modern, and type-safe ecosystem:

- **Node.js**: JavaScript runtime environment.
- **Express.js (v5)**: Web framework for Node.js, utilizing its native async error-handling support.
- **TypeScript**: Static typing superset for JavaScript, ensuring type safety across the application.
- **Prisma ORM**: Next-generation Node.js and TypeScript ORM for interacting with the PostgreSQL database.
- **PostgreSQL**: Relational database (running via Docker).
- **Zod**: TypeScript-first schema declaration and validation library (used for payload validation in controllers).
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for physical file uploads (Avatars and Ticket Attachments).
- **Jest & Supertest**: Testing framework for unit and integration tests.

## 🏗️ Architecture & Structure

The project follows a modular, controller-based architecture standard (widely taught by Rocketseat), ensuring separation of concerns:

```
backend/
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma data model definition
│   └── seed.ts           # Database seeding script (Admins, Services, Techs)
├── src/
│   ├── configs/          # General configurations (e.g., upload/multer settings)
│   ├── controllers/      # Route handlers (Business logic boundaries)
│   ├── database/         # Database connection singletons (Prisma Client)
│   ├── middlewares/      # Express middlewares (Auth, Role Checking, Error Handling)
│   ├── providers/        # External services wrappers (e.g., DiskStorageProvider)
│   ├── routes/           # API Endpoints definitions (Express Routers)
│   ├── tests/            # Automated integration test suites
│   ├── utils/            # Helper classes (e.g., AppError)
│   ├── app.ts            # Express App initialization and global middlewares
│   ├── env.ts            # Environment variable validation via Zod
│   └── server.ts         # Server entry point (starts the listener on port 3333)
└── tmp/
    └── uploads/          # Physical storage for user avatars and attachments
```

## 🔐 Authentication & Authorization (RBAC)

The application implements **Role-Based Access Control (RBAC)**.
Every user in the system has a `role` field in the database, represented by an Enum: `ADMIN`, `TECHNICIAN`, or `CLIENT`.

- **Authentication**: Handled via JWT (JSON Web Tokens). The `POST /sessions` endpoint returns a token that must be sent in the `Authorization: Bearer <token>` header for protected routes.
- **Middlewares**:
  - `ensureAuthenticated`: Validates the JWT token and extracts the `userId` and `role`.
  - `verifyUserRole(roles)`: Checks if the authenticated user's role matches one of the permitted roles for a specific route.

## 📋 Core Modules

### 1. Users & Profile
- **Clients Registration**: Public endpoint (`POST /users`) for clients to self-register.
- **Profile Management**: Protected endpoints (`GET /profile`, `PUT /profile`) for logged-in users to update their own data (including passwords).
- **Avatars**: Physical file upload (`PATCH /profile/avatar`) using Multer and DiskStorageProvider.

### 2. Admin Module
- **Technicians**: Admins can create and manage Technicians.
- **Services**: Admins can create and manage Services (includes soft delete using the `isActive` flag instead of hard deletion to preserve historical ticket data).

### 3. Tickets (Chamados)
- The core of the system.
- **Creation**: Clients can create tickets, assigning them to a Technician and attaching up to 5 files.
- **Listing**: Smart filtering based on role:
  - Clients only see their own tickets.
  - Technicians only see tickets assigned to them.
  - Admins see all tickets.
- **Updates**: Technicians and Admins can update the `status` (OPEN, IN_PROGRESS, CLOSED) and link `services` (additional costs/tasks) to a ticket.

## 🧪 Testing

The backend includes an automated test suite located in `src/tests/`. It uses Jest with `ts-jest` for TypeScript execution and Supertest for HTTP assertions.

Run tests using:
```bash
npm run test
```

## 🛠️ Environment Variables

The application expects an `.env` file at the root of the `backend/` directory:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/helpdesk?schema=public"
JWT_SECRET="your_super_secret_key"
PORT=3333
```
*(Zod validates these variables at startup via `src/env.ts`)*.

## 🚀 Running the Application

1. **Database Setup**: Start the PostgreSQL container (`docker-compose up -d`) and run `npx prisma migrate dev`.
2. **Seed Data**: Run `npx prisma db seed` to populate the database with initial data (1 Admin, 3 Techs, 5 Services).
3. **Start Server**: Run `npm run dev` to start the development server using `tsx watch` for hot-reloading.
