import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (
  file: Buffer | string,
  folder: string
): Promise<{ url: string; publicId: string }> => {
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject((error as Error) ?? new Error("Cloudinary upload failed"));
      resolve(result);
    });

    if (typeof file === "string") {
      // base64 data URL or file path
      cloudinary.uploader.upload(file, { folder }, (error, result) => {
        if (error || !result) return reject((error as Error) ?? new Error("Cloudinary upload failed"));
        resolve(result);
      });
    } else {
      uploadStream.end(file);
    }
  });

  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
