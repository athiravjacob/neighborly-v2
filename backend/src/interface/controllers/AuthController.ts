import { AuthenticateWithGoogleUsecase } from "../../application/usecase/auth/AuthenticateWithGoogleUsecase";
import { LoginWithEmailUsecase } from "../../application/usecase/auth/LoginWithEmailUsecase";
import { SignupWithEmailUsecase } from "../../application/usecase/auth/SignupWithEmailUsecase";
import { Request, Response } from "express";
import { validateRequest } from "../validators/validateRequest";
import { signupWithEmailSchema } from "../validators/signupWithEmail.schema";
import { handleError } from "../errors/handleError";
import { loginWithEmailSchema } from "../validators/loginWithEmail.schema";
import { authenticateWithGoogleSchema } from "../validators/authenticateWithGoogle.schema";
import { ForgotPasswordUsecase } from "../../application/usecase/auth/ForgotPasswordUsecase";
import { ResetPasswordUsecase } from "../../application/usecase/auth/ResetPasswordUsecase";
import { resetPasswordSchema } from "../validators/resetPassword.schema";

export class AuthController{
    constructor(
        private signupWithEmailUsecase:SignupWithEmailUsecase,
        private loginwithEmailUsecase:LoginWithEmailUsecase,
        private authenticateWithGoogleUsecase:AuthenticateWithGoogleUsecase,
        private forgotPasswordUsecase:ForgotPasswordUsecase,
        private resetPasswordUsecase:ResetPasswordUsecase
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
    
    async forgotPassword(req:Request,res:Response){
      try {
        const {email} = req.body
        const result = await this.forgotPasswordUsecase.execute(email)
        console.log(result.token)
        return res.status(200).json(result)

      } catch (error) {
        return handleError(error, res);

      }
    }

    async resetPassword(req:Request,res:Response){
      try {
        const {newPassword} = validateRequest(resetPasswordSchema ,req.body)
        const token = req.query.token as string
        if(!token) throw new Error("No reset token available")
        const input ={newPassword,token}
        await this.resetPasswordUsecase.execute(input)
        return res.status(200).json("Password reset success .please login")
      } catch (error) {
        return handleError(error, res); 
      }

    }

}