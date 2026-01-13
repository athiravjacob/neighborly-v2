import { SignupWithEmailUsecase } from "../../application/usecase/auth/SignupWithEmailUsecase";
import { AuthController } from "../../interface/controllers/AuthController";
import {  UserRepositoryMongo } from "../persistence/mongo/repositories/UserRepositoryMongo";
import { BcryptHashPassword } from "../security/BcryptHashPassword";

const userRepository = new UserRepositoryMongo()
const passwordHasher = new BcryptHashPassword()

const signupWithEmailUsecase = new SignupWithEmailUsecase(
    userRepository,passwordHasher
)
export const authController = new AuthController(
    signupWithEmailUsecase
)