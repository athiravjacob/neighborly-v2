import bcrypt from "bcryptjs/umd/types";
import { IPasswordVerifier } from "../../application/port/IPasswordVerifier";

export class BcryptVerifyPassword implements IPasswordVerifier{
    verify(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain,hash)
    }
    
}