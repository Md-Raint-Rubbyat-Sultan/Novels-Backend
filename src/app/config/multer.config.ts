import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUploder } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUploder,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLocaleLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\.+/g, "-")
        .replace(/[^a-z0-9\-\.]/g, "");

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now +
        "-" +
        fileName;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage });
