import { Router } from "express";
import multer from "multer";
import { TicketsController } from "../controllers/tickets-controller";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { verifyUserRole } from "../middlewares/verify-user-role";
import { UPLOAD_CONFIG } from "../configs/upload";

export const ticketsRoutes = Router();
const ticketsController = new TicketsController();
const upload = multer(UPLOAD_CONFIG.multer);

ticketsRoutes.use(ensureAuthenticated);

ticketsRoutes.get("/", ticketsController.index);
ticketsRoutes.get("/:id", ticketsController.show);

// Criação de chamados (Somente clientes - mas Admin tb poderia ser liberado, restringiremos a CLIENT para seguir a regra)
ticketsRoutes.post(
  "/",
  verifyUserRole(["CLIENT", "ADMIN"]),
  upload.array("attachments", 5), // Permite até 5 anexos
  ticketsController.create
);

// Edição de status e serviços (Apenas Técnicos e Admins)
ticketsRoutes.put(
  "/:id",
  verifyUserRole(["TECHNICIAN", "ADMIN"]),
  ticketsController.update
);
