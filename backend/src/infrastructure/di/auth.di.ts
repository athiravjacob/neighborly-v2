import { AuthenticateWithGoogleUsecase } from "../../application/usecase/auth/AuthenticateWithGoogleUsecase";
import { ForgotPasswordUsecase } from "../../application/usecase/auth/ForgotPasswordUsecase";
import { LoginWithEmailUsecase } from "../../application/usecase/auth/LoginWithEmailUsecase";
import { ResetPasswordUsecase } from "../../application/usecase/auth/ResetPasswordUsecase";
import { SignupWithEmailUsecase } from "../../application/usecase/auth/SignupWithEmailUsecase";
import { AuthController } from "../../interface/controllers/AuthController";
import { RefreshTokenRepositoryMongo } from "../persistence/mongo/repositories/RefreshTokenRepositoryMongo";
import { ResetTokenRepositoryMongo } from "../persistence/mongo/repositories/ResetPasswordTokenRepositoryMongo";
import {  UserRepositoryMongo } from "../persistence/mongo/repositories/UserRepositoryMongo";
import { BcryptHasher } from "../services/BcryptHasher";
import { GoogleTokenVerifier } from "../services/GoogleTokenVerifier";
import { JwtServices } from "../services/JwtServices";
import { NodemailerEmailService } from "../services/NodemailerEmailService";

const userRepository = new UserRepositoryMongo()
const hasher = new BcryptHasher()
const jwtServices= new JwtServices()
const refreshTokenRepository = new RefreshTokenRepositoryMongo()
const googleTokenVerifier = new GoogleTokenVerifier(
    process.env.GOOGLE_CLIENT_ID!
  );
const resetPasswordTokenRepository = new ResetTokenRepositoryMongo()
const emailServices = new NodemailerEmailService()


const signupWithEmailUsecase = new SignupWithEmailUsecase(
    userRepository,hasher
)
const loginWithEmailUsecase = new LoginWithEmailUsecase(userRepository,hasher,jwtServices,refreshTokenRepository)
const authenticateWithGoogle = new AuthenticateWithGoogleUsecase(userRepository,googleTokenVerifier,jwtServices,hasher,refreshTokenRepository)
const forgotPasswordUsecase = new ForgotPasswordUsecase(userRepository,resetPasswordTokenRepository,emailServices,process.env.FRONTEND_BASE_URL!)
const resetPasswordUsecase = new ResetPasswordUsecase(userRepository,hasher,resetPasswordTokenRepository)
export const authController = new AuthController(
    signupWithEmailUsecase,
    loginWithEmailUsecase,
    authenticateWithGoogle,
    forgotPasswordUsecase,
    resetPasswordUsecase
)