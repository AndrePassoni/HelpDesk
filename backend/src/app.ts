import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { UPLOAD_CONFIG } from "./configs/upload";
import { errorHandling } from "./middlewares/error-handling";

export const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Avatares e futuramente Anexos dos Chamados)
app.use("/files", express.static(UPLOAD_CONFIG.UPLOADS_FOLDER));

app.use(routes);

app.use(errorHandling);
