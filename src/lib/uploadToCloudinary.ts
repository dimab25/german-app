import { cloudinary } from "@/cloudinary/config"; // your config path
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";


type UploadResponse = 
  { success: true; result?: UploadApiResponse } | 
  { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string, fileName: string): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "image",
        filename_override: fileName,
        folder: "german-app",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};
export {uploadToCloudinary};