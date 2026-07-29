import { Router } from "express";
import { ServicesController } from "../controllers/services-controller";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { verifyUserRole } from "../middlewares/verify-user-role";

export const servicesRoutes = Router();
const servicesController = new ServicesController();

servicesRoutes.use(ensureAuthenticated);

// Clientes e Técnicos podem apenas listar
servicesRoutes.get("/", servicesController.index);

// Apenas Admin pode gerenciar
servicesRoutes.post("/", verifyUserRole(["ADMIN"]), servicesController.create);
servicesRoutes.put("/:id", verifyUserRole(["ADMIN"]), servicesController.update);
servicesRoutes.delete("/:id", verifyUserRole(["ADMIN"]), servicesController.delete);
