<div align="center">
  <img src="./.github/assets/cover.png" alt="HelpDesk - Fullstack Challenge" width="100%" />

  <br />
  <br />

  # 🛠️ HelpDesk System
  
  **The final graduation project for the Rocketseat Fullstack Course.**<br/>
  A complete, robust, and scalable ticketing management system built with modern web technologies.

  <p align="center">
    <a href="#-about-the-project">About</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture--structure">Architecture</a> •
    <a href="#-acknowledgments">Acknowledgments</a>
  </p>
</div>

---

## 📖 About the Project

This project represents the culmination of the **Rocketseat Fullstack Formation**. The goal was to build a real-world, production-ready HelpDesk application from scratch, dealing with complex business logic, role-based access control (RBAC), database relationships, and a pixel-perfect, highly responsive user interface.

It is designed to facilitate communication and issue tracking between clients and technical support teams. With a clear separation of concerns, the system ensures that clients can easily report issues, while technicians and administrators have powerful tools to manage, assign, and resolve tickets efficiently.

## ✨ Key Features

- **🛡️ Role-Based Access Control (RBAC):** Distinct dashboards and permissions for `ADMIN`, `TECHNICIAN`, and `CLIENT`.
- **🎫 Comprehensive Ticket Management:** Full lifecycle management of support tickets—from creation by the client to progress tracking and resolution by technicians.
- **📊 Admin Dashboard:** Centralized control to manage users (technicians and clients), system services, and overarching ticket metrics.
- **📱 Responsive & Premium UI:** Designed with a "mobile-first" mentality but scales beautifully to desktop, featuring glassmorphism, tailored color palettes, and micro-animations.
- **🧪 Quality Assurance:** End-to-End (E2E) testing implemented with Playwright to guarantee navigation and flow integrity.
- **🗄️ Resilient Data Modeling:** Robust PostgreSQL database with Prisma ORM, utilizing features like `onDelete: Cascade` and soft deletes to maintain data integrity.

## 💻 Tech Stack

This project is a monorepo separated into a highly optimized frontend and a robust backend API.

### Frontend
- **React (Vite)** - Blazing fast UI development.
- **TypeScript** - Strict typing for scalable code.
- **Tailwind CSS** - Utility-first styling for a premium look.
- **React Hook Form & Zod** - Form handling and validation.
- **Playwright** - End-to-End testing.

### Backend
- **Node.js & Express** - Efficient and scalable REST API.
- **TypeScript** - Type-safe backend architecture.
- **Prisma ORM** - Next-generation Node.js and TypeScript ORM.
- **PostgreSQL** - Relational database management.
- **Jest** - Unit and integration testing.

## 🏗️ Architecture & Structure

The repository is organized as a monorepo to separate concerns while maintaining a unified version history. **For detailed instructions on how to run each part of the system, please refer to their specific documentations:**

- 📂 [**Frontend Documentation**](./frontend/README.md) - Contains details about the React application, UI setup, and E2E testing.
- 📂 [**Backend Documentation**](./backend/README.md) - Contains details about the Node.js API, database schemas, and unit testing.

## 🎓 Acknowledgments

This project was developed as the final challenge of the **[Rocketseat](https://www.rocketseat.com.br/) Fullstack Course**. It applies everything learned throughout the journey: from basic fundamentals to advanced concepts like API design, frontend performance optimization, security, and automated testing.

---
<div align="center">
  Developed with 💜 by André
</div>
