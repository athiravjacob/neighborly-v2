import { randomUUID } from "crypto";
import { IFileStorage } from "../../application/port/IFileStorage";
import { cloudinary } from "../config/cloudinary.config";
export class CloudinaryStorage implements IFileStorage{
    
    async uploadProfileImage(buffer: Buffer, filename: string): Promise<string> {
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "profile_pictures",
                public_id: randomUUID(),
                resource_type: "image",
                transformation: [
                  { width: 300, height: 300, crop: "fill" },
                  { quality: "auto", fetch_format: "auto" }
                ]
              },
              (error, result) => {
                if (error) {
                  return reject(error);
                }
      
                if (!result?.secure_url) {
                  return reject(new Error("Cloudinary upload failed"));
                }
      
                resolve(result.secure_url);
              }
            ).end(buffer);
          });    }
    
}