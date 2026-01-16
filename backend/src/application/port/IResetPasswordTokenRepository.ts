import { TokenInfo } from "google-auth-library"

export interface IResetPasswordTokenRepository{
    save(userId:string,tokenHash:string,expiresAt:Date):Promise<void>
    findByTokenHash(incomingTokenHash:string):Promise<string|null>
    deleteToken(tokenHash:string):Promise<void>
}