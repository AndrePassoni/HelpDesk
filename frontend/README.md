# HelpDesk Frontend

Welcome to the **HelpDesk Frontend** application! This is a modern, responsive, and robust Single Page Application (SPA) built to consume the HelpDesk API. It offers distinct dashboards and access levels for Administrators, Technicians, and Clients, following premium UI/UX design standards.

## 🚀 Technologies Used

- **React (Vite):** Blazing fast development environment and optimized production builds.
- **TypeScript:** Strict typing to ensure reliability and autocompletion across the codebase.
- **Tailwind CSS:** Utility-first CSS framework used for a completely custom, responsive, and pixel-perfect UI.
- **React Router DOM:** Client-side routing with protected routes and RBAC (Role-Based Access Control) integrations.
- **React Hook Form & Zod:** Powerful schema-based form validation.
- **Axios:** HTTP client for robust API communications.
- **Lucide React:** Beautiful, consistent, and lightweight SVGs icons.
- **Playwright:** End-to-End (E2E) testing framework to assure quality and navigation integrity.

## 📦 Features

- **RBAC Authentication:** 
  - Dynamic routing and layout changes depending on whether the user is an `ADMIN`, `TECHNICIAN`, or `CLIENT`.
  - Secure session handling using JWT stored in local storage and interceptors to attach tokens to API requests.
- **Advanced Dashboards:**
  - **Admin View:** Full control over Tickets, Services, Technicians, and Customers with intuitive table interfaces and status toggles.
  - **Technician View:** Kanban-style or Grid-style ticket organization allowing technicians to quickly start and close tickets.
  - **Client View:** Simplified view to easily request new services and track current tickets.
- **Premium UI / UX:** 
  - Glassmorphism effects, smooth micro-animations, tailored color palettes, and fully responsive modals and sidebars.
  - File upload previews for updating avatars seamlessly.

## 🛠️ Setup & Installation

Make sure you have [Node.js](https://nodejs.org/en/) installed (version 18+ recommended).

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:5173`.

3. **Build for production:**
   ```bash
   npm run build
   ```
   This will output optimized static assets into the `dist/` directory.

## 🧪 E2E Testing

This project uses Playwright for comprehensive End-to-End testing. 

1. Ensure the development server is running on port `5173`.
2. Run the E2E tests:
   ```bash
   npx playwright test
   ```
   *(To open the interactive UI mode for debugging, run `npx playwright test --ui`)*

## 🌐 Deployment Configuration

This frontend is configured and ready to be deployed on platforms like **Vercel** or **Netlify**. 
A `vercel.json` file is already included at the root of the `frontend` directory to handle React Router's SPA fallbacks (`rewrites`).
