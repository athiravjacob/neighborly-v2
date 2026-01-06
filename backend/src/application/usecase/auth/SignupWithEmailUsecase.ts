import { UserRole } from "../../../domain/enums/UserRole";
import {  IUserRepository } from "../../../domain/user/IUserRepository";
import { User } from "../../../domain/user/User";
import { IHashPassword } from "../../port/IHashPassword";

type SignupRole = UserRole.HELPER | UserRole.SEEKER;

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

function isSignupRole(role: UserRole): role is SignupRole {
  return role === UserRole.HELPER || role === UserRole.SEEKER;
}


export class SignupWithEmailUsecase{
    private constructor(
        private userRepository: IUserRepository,
        private hashPassword :IHashPassword
    ){}

    async execute(input:SignupWithEmailInput):Promise<SignupWithEmailOutput>{
        const {name,email,phone,password,role} = input

        if(!email ||!password || !role) throw new Error("email,role and password required")

        if(!isSignupRole(role)) throw new Error("Invalid role for signup")

        const existingUser =await this.userRepository.findByEmail(email)
        if(existingUser){
            throw new Error("User already exists")
        }

        const passwordHash = await this.hashPassword.hash(password)
        const user = User.registerWithEmail(name,email,phone,passwordHash,role)
        const savedUser = await this.userRepository.save(user)
       


        return {
            id:user.getId(),
            email,
            role

        }
    }


}