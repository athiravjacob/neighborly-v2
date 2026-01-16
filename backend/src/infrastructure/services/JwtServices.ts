import jwt from "jsonwebtoken";
import { IJwtServices } from "../../application/port/IJwtServices";
import { UserRole } from "../../domain/enums/UserRole";
import dotenv from "dotenv";
dotenv.config()

export class JwtServices implements IJwtServices{
    async generateRefreshToken(payload: { userId: string; }): Promise<string> {
        return jwt.sign(payload,process.env.JWT_SECRET!,{ expiresIn: "7d"})
    }
    async generateAccessToken(payload: { userId: string; role: UserRole; }): Promise<string> {
        return jwt.sign(payload,process.env.JWT_SECRET!,{ expiresIn: "1h"})
    }
    
    
}