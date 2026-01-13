import { IHashPassword } from "../../application/port/IHashPassword";
import bcrypt from "bcryptjs";

export class BcryptHashPassword implements IHashPassword{
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password,10)
         }
    
}