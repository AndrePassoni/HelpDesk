import { Router } from "express";
import { sessionsRoutes } from "./sessions-routes";

export const routes = Router();

routes.use("/sessions", sessionsRoutes);
