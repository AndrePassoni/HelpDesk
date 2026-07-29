import { Router } from "express";
import { sessionsRoutes } from "./sessions-routes";
import { techniciansRoutes } from "./technicians-routes";
import { servicesRoutes } from "./services-routes";
import { usersRoutes } from "./users-routes";
import { profileRoutes } from "./profile-routes";

export const routes = Router();

routes.use("/sessions", sessionsRoutes);
routes.use("/users", usersRoutes);
routes.use("/profile", profileRoutes);
routes.use("/technicians", techniciansRoutes);
routes.use("/services", servicesRoutes);
