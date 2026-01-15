import { AuthenticateWithGoogleUsecase } from "../../application/usecase/auth/AuthenticateWithGoogleUsecase";
import { LoginWithEmailUsecase } from "../../application/usecase/auth/LoginWithEmailUsecase";
import { SignupWithEmailUsecase } from "../../application/usecase/auth/SignupWithEmailUsecase";
import { AuthController } from "../../interface/controllers/AuthController";
import { RefreshTokenRepositoryMongo } from "../persistence/mongo/repositories/RefreshTokenRepositoryMongo";
import {  UserRepositoryMongo } from "../persistence/mongo/repositories/UserRepositoryMongo";
import { BcryptHasher } from "../security/BcryptHasher";
import { GoogleTokenVerifier } from "../security/GoogleTokenVerifier";
import { JwtServices } from "../security/JwtServices";

const userRepository = new UserRepositoryMongo()
const hasher = new BcryptHasher()
const jwtServices= new JwtServices()
const refreshTokenRepository = new RefreshTokenRepositoryMongo()
const googleTokenVerifier = new GoogleTokenVerifier(
    process.env.GOOGLE_CLIENT_ID!
  );

const signupWithEmailUsecase = new SignupWithEmailUsecase(
    userRepository,hasher
)

const loginWithEmailUsecase = new LoginWithEmailUsecase(userRepository,hasher,jwtServices,refreshTokenRepository)
const authenticateWithGoogle = new AuthenticateWithGoogleUsecase(userRepository,googleTokenVerifier,jwtServices,hasher,refreshTokenRepository)

export const authController = new AuthController(
    signupWithEmailUsecase,
    loginWithEmailUsecase,
    authenticateWithGoogle
)