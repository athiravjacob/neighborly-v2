import { UserRole } from "../../../domain/enums/UserRole";
import { IUserRepository } from "../../../domain/user/IUserRepository";
import { IHashPassword } from "../../port/IHashPassword";
import { IPasswordVerifier } from "../../port/IPasswordVerifier";

type LoginWithEmailInput={
    email:string,
    password:string
}

type LoginWithEmailOutput ={
    id:string,
    email:string,
    role:UserRole
}

export class LoginWithEmailUsecase{
    private constructor(
        private userRepository :IUserRepository,
        private hashPassword :IHashPassword,
        private verifyPassword :IPasswordVerifier
    ){}

    async execute(input:LoginWithEmailInput):Promise<LoginWithEmailOutput>{
        const{email,password} = input
        if(!email || !password) throw new Error("Email and password Required")

        const user = await this.userRepository.findByEmail(email)
        if(!user)
            throw new Error("Invalid email or password")

        if(!user.canLogin()){
            throw new Error("You are blocked by the admin")
        }
        
        const auth = user.getEmailAuth()
        if (!auth) {
            throw new Error("Email login not available for this account")
          }
        const storedHash = auth.getPasswordHash()

        if(!storedHash) throw new Error("Invalid login method")

        const isValid = await this.verifyPassword.verify(password,storedHash)
        if(!isValid) throw new Error("Invalid credentials")

        return{
            id:user.getId(),
            email,
            role:user.getRole()
        }
    }
}