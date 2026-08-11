import { Router } from "express";
import { UsersController } from "../controllers/users-controller";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { verifyUserRole } from "../middlewares/verify-user-role";

export const usersRoutes = Router();
const usersController = new UsersController();

// Cadastro de novo cliente (público)
usersRoutes.post("/", usersController.create);

// Listagem, edição e exclusão de Clientes (somente Admin)
usersRoutes.get("/", ensureAuthenticated, verifyUserRole(["ADMIN"]), usersController.index);
usersRoutes.put("/:id", ensureAuthenticated, verifyUserRole(["ADMIN"]), usersController.update);
usersRoutes.delete("/:id", ensureAuthenticated, verifyUserRole(["ADMIN"]), usersController.delete);
