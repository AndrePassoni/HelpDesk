import { Router } from "express";
import { UsersController } from "../controllers/users-controller";

export const usersRoutes = Router();
const usersController = new UsersController();

// Cadastro de novo cliente (público)
usersRoutes.post("/", usersController.create);
