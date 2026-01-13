import { SignupRole, UserRole } from "../../../domain/enums/UserRole"
import { IUserRepository } from "../../../domain/user/IUserRepository"
import { User } from "../../../domain/user/User"
import { isSignupRole } from "./SignupWithEmailUsecase"

type authenticateWithGoogleInput={
    name:string,
    email:string,
    phone?:string,
    googleId :string,
    role:SignupRole
}

type authenticateWithGoogleOutput={
    id:string,
    email:string,
    role:SignupRole
}

export class AuthenticateWithGoogleUsecase{
    constructor(
        private userRepository:IUserRepository
    ){}
    async execute(input:authenticateWithGoogleInput):Promise<authenticateWithGoogleOutput>{
        const {name,email,phone,googleId,role} = input

        if(!isSignupRole(role)) throw new Error("Invalid role for signup")

        const userByGoogle = await this.userRepository.findByGoogleId(googleId)
        if(userByGoogle) {
            return{
                id:userByGoogle.getId(),
                email,
                role
            }

        }

        const existingUser = await this.userRepository.findByEmail(email)
        if(existingUser){
            const updatedUser = existingUser.linkGoogleAccount(googleId);

       
        const savedUser = await this.userRepository.save(updatedUser);
            return {
                id:savedUser.getId(),
                email,
                role
            }

        }

        const user = User.registerWithGoogle(name,email,googleId,role,phone)
        const savedUser =await this.userRepository.save(user)
        return {
            id: savedUser .getId(),
            email,
            role
        }
    }
}