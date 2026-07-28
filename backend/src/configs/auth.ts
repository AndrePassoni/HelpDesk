import { env } from "../env";

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET || "default_secret",
    expiresIn: "1d",
  },
};
