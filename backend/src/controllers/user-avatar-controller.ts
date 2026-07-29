import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { DiskStorageProvider } from "../providers/DiskStorageProvider";

export class UserAvatarController {
  async update(request: Request, response: Response) {
    const userId = request.user!.id;
    const avatarFilename = request.file?.filename;

    if (!avatarFilename) {
      throw new AppError("No file provided", 400);
    }

    const diskStorage = new DiskStorageProvider();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("Only authenticated users can change avatar", 401);
    }

    // Deleta a imagem antiga, se existir
    if (user.imageUrl) {
      await diskStorage.deleteFile(user.imageUrl);
    }

    // Salva a nova imagem na pasta uploads
    const filename = await diskStorage.saveFile(avatarFilename);

    user.imageUrl = filename;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        imageUrl: filename,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
      },
    });

    return response.json(updatedUser);
  }
}
