import fs from "fs";
import path from "path";
import { UPLOAD_CONFIG } from "../configs/upload";

export class DiskStorageProvider {
  async saveFile(file: string) {
    // Garante que a pasta uploads existe
    if (!fs.existsSync(UPLOAD_CONFIG.UPLOADS_FOLDER)) {
      fs.mkdirSync(UPLOAD_CONFIG.UPLOADS_FOLDER, { recursive: true });
    }

    await fs.promises.rename(
      path.resolve(UPLOAD_CONFIG.TMP_FOLDER, file),
      path.resolve(UPLOAD_CONFIG.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file: string) {
    const filePath = path.resolve(UPLOAD_CONFIG.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
