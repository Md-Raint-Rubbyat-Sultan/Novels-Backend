import { UploadApiResponse, v2 } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/appError";
import stream from "stream";

v2.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (
  buffer: Buffer,
  filename: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${filename}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end();

      v2.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    throw new AppError(401, `Unable to upload in cloudinary. ${error.message}`);
  }
};

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regEx = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regEx);

    if (match && match[1]) {
      const public_id = match[1];
      await v2.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudniary`);
    }
  } catch (error) {
    throw new AppError(401, "Failed to delete image.");
  }
};

export const cloudinaryUploder = v2;
