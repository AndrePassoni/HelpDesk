import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function verifyUserRole(rolesToVerify: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const { role } = request.user!;

    if (!rolesToVerify.includes(role)) {
      throw new AppError("Unauthorized", 401);
    }

    return next();
  };
}
