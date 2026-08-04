import { Router } from "express";
import { TechniciansController } from "../controllers/technicians-controller";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { verifyUserRole } from "../middlewares/verify-user-role";

export const techniciansRoutes = Router();
const techniciansController = new TechniciansController();

techniciansRoutes.use(ensureAuthenticated);

techniciansRoutes.get("/", techniciansController.index);
techniciansRoutes.post("/", verifyUserRole(["ADMIN"]), techniciansController.create);
techniciansRoutes.put("/:id", verifyUserRole(["ADMIN"]), techniciansController.update);
techniciansRoutes.delete("/:id", verifyUserRole(["ADMIN"]), techniciansController.delete);
