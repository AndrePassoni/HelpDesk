import path from "path";
import multer from "multer";
import crypto from "crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

export const UPLOAD_CONFIG = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  multer: {
    storage: multer.diskStorage({
      destination: TMP_FOLDER,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString("hex");
        const filename = `${fileHash}-${file.originalname.replace(/\s/g, "_")}`;

        return callback(null, filename);
      },
    }),
  },
};
