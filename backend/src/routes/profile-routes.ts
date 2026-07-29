import { Router } from "express";
import multer from "multer";
import { ProfileController } from "../controllers/profile-controller";
import { UserAvatarController } from "../controllers/user-avatar-controller";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { UPLOAD_CONFIG } from "../configs/upload";

export const profileRoutes = Router();
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

const upload = multer(UPLOAD_CONFIG.multer);

// O usuário deve estar logado para acessar seu perfil
profileRoutes.use(ensureAuthenticated);

profileRoutes.get("/", profileController.show);
profileRoutes.put("/", profileController.update);
profileRoutes.patch("/avatar", upload.single("avatar"), userAvatarController.update);
