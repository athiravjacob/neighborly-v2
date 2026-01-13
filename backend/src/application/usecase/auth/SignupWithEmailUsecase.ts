import { SignupRole, UserRole } from "../../../domain/enums/UserRole";
import {  IUserRepository } from "../../../domain/user/IUserRepository";
import { User } from "../../../domain/user/User";
import { AppError } from "../../errors/AppError";
import { ErrorCatalog } from "../../errors/ErrorCatalog";
import { IHashPassword } from "../../port/IHashPassword";


type SignupWithEmailInput={
    name:string,
    email:string,
    phone:string,
    password:string,
    role:SignupRole
}

type SignupWithEmailOutput={
    id:string,
    email:string,
    role:SignupRole
}

export function isSignupRole(role: UserRole): role is SignupRole {
  return role === UserRole.HELPER || role === UserRole.SEEKER;
}


export class SignupWithEmailUsecase{
     constructor(
        private userRepository: IUserRepository,
        private hashPassword :IHashPassword
    ){}

    async execute(input:SignupWithEmailInput):Promise<SignupWithEmailOutput>{
        const {name,email,phone,password,role} = input
        const existingUser =await this.userRepository.findByEmail(email)
        if(existingUser){
            throw new AppError(ErrorCatalog.EMAIL_ALREADY_EXISTS);
        }

        const passwordHash = await this.hashPassword.hash(password)
        const user = User.registerWithEmail(name,email,phone,passwordHash,role)
        await this.userRepository.save(user)
        return {
            id:user.getId(),
            email,
            role

        }
    }


}