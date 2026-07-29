import { Router } from "express";
import { TechniciansController } from "../controllers/technicians-controller";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { verifyUserRole } from "../middlewares/verify-user-role";

export const techniciansRoutes = Router();
const techniciansController = new TechniciansController();

techniciansRoutes.use(ensureAuthenticated);
techniciansRoutes.use(verifyUserRole(["ADMIN"]));

techniciansRoutes.get("/", techniciansController.index);
techniciansRoutes.post("/", techniciansController.create);
techniciansRoutes.put("/:id", techniciansController.update);
techniciansRoutes.delete("/:id", techniciansController.delete);
