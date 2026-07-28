import express from "express";
import cors from "cors";
import { errorHandling } from "./middlewares/error-handling";
import { routes } from "./routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errorHandling);
