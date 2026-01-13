import { AuthenticateWithGoogleUsecase } from "../../application/usecase/auth/AuthenticateWithGoogleUsecase";
import { LoginWithEmailUsecase } from "../../application/usecase/auth/LoginWithEmailUsecase";
import { SignupWithEmailUsecase } from "../../application/usecase/auth/SignupWithEmailUsecase";
import { Request, Response } from "express";
import { validateRequest } from "../validators/validateRequest";
import { signupWithEmailSchema } from "../validators/signupWithEmail.schema";
import { handleError } from "../errors/handleError";

export class AuthController{
    constructor(
        private signupWithEmailUsecase:SignupWithEmailUsecase,
    ){}

    async signupWithEmail(req:Request,res:Response){
        try {
          const input = validateRequest(signupWithEmailSchema, req.body);
          const userDTO = await this.signupWithEmailUsecase.execute(input);
            return res.status(201).json(userDTO);

        } catch (error:any) {
          return handleError(error, res);

        }
    }
    
    

}