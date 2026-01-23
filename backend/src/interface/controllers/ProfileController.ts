import { GetOrCreateUsecase } from "../../application/usecase/userProfile/GetOrCreateProfileUsecase";
import { Request ,Response} from "express";
import { validateRequest } from "../validators/validateRequest";
import { updatePersonalDetailsSchema } from "../validators/updatePersonalDetails.schema";
import { UpdatePersonalDetailsUsecase } from "../../application/usecase/userProfile/UpdatePersonalDetailsUsecase";
import { ZodError } from "zod";
import { UpdateProfilePictureUsecase } from "../../application/usecase/userProfile/UpdateProfilePictureUsecase";
export class ProfileController{
    constructor(
        private getProfileUsecase :GetOrCreateUsecase,
        private updatePersonalDetailsUsecase :UpdatePersonalDetailsUsecase,
        private updateProfilePicUsecase:UpdateProfilePictureUsecase
    ){}


    async getProfileDetails(req:Request,res:Response){
        try {
            const userId = req.user!.id
            const profile = await this.getProfileUsecase.execute({userId})
            return res.status(200).json(profile);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to fetch profile" });
        }
    }

    async updatePersonalDetails(req:Request,res:Response){
        try {
            const userId = req.user!.id
            const validateBody=validateRequest(updatePersonalDetailsSchema,req.body)
            
    const result = await this.updatePersonalDetailsUsecase.execute({
        userId,
        ...validateBody,
      });
  
      return res.status(200).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                  message: "Invalid request body",
                  errors: error.message,
                });
              }
          
              console.error(error);
              return res.status(500).json({ message: "Failed to update profile" });
            }  
        }

    async updateProfilePicture(req:Request,res:Response){
        try {
            const userId = req.user!.id
            if (!req.file) {
                return res.status(400).json({
                  message: "Profile picture file is required",
                });
              }
          
              const result = await this.updateProfilePicUsecase.execute({
                userId,
                buffer: req.file.buffer,
              });
          
              return res.status(200).json(result);
        } catch (error) {
            
        }
    }
    }
