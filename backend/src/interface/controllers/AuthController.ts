import { AuthenticateWithGoogleUsecase } from "../../application/usecase/auth/AuthenticateWithGoogleUsecase";
import { LoginWithEmailUsecase } from "../../application/usecase/auth/LoginWithEmailUsecase";
import { SignupWithEmailUsecase } from "../../application/usecase/auth/SignupWithEmailUsecase";
import { Request, Response } from "express";
import { validateRequest } from "../validators/validateRequest";
import { signupWithEmailSchema } from "../validators/signupWithEmail.schema";
import { handleError } from "../errors/handleError";
import { loginWithEmailSchema } from "../validators/loginWithEmail.schema";
import { authenticateWithGoogleSchema } from "../validators/authenticateWithGoogle.schema";

export class AuthController{
    constructor(
        private signupWithEmailUsecase:SignupWithEmailUsecase,
        private loginwithEmailUsecase:LoginWithEmailUsecase,
        private authenticateWithGoogleUsecase:AuthenticateWithGoogleUsecase
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
    async loginWithEmail(req:Request,res:Response){
      try {
        const input = validateRequest(loginWithEmailSchema,req.body)
        const authResult = await this.loginwithEmailUsecase.execute(input)
        return res.status(200).json(authResult);

      } catch (error) {
        return handleError(error, res);
      }
    }

    async authenticateWithGoogle(req:Request,res:Response){
      try {
        const {idToken,role} = validateRequest(authenticateWithGoogleSchema,req.body)
        const authResult = await this.authenticateWithGoogleUsecase.execute({ idToken,role });
        return res.status(200).json(authResult)

      } catch (error) {
        return handleError(error, res);
      }
    }
    
    

}