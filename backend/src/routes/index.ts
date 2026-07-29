import { Router } from "express";
import { sessionsRoutes } from "./sessions-routes";
import { techniciansRoutes } from "./technicians-routes";
import { servicesRoutes } from "./services-routes";

export const routes = Router();

routes.use("/sessions", sessionsRoutes);
routes.use("/technicians", techniciansRoutes);
routes.use("/services", servicesRoutes);
