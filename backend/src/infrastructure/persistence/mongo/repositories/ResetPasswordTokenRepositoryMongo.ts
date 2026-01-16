import { IResetPasswordTokenRepository } from "../../../../application/port/IResetPasswordTokenRepository";
import { ResetTokenModel } from "../schemas/ResetTokenSchema";

export  class ResetTokenRepositoryMongo implements IResetPasswordTokenRepository{
    async deleteToken(tokenHash: string): Promise<void> {
        await ResetTokenModel.findOneAndDelete({tokenHash})
    }
     async findByTokenHash(incomingTokenHash: string): Promise<string|null> {
        const tokeninfo= await ResetTokenModel.findOne({tokenHash:incomingTokenHash, expiresAt: { $gt: new Date() }})
  
        return tokeninfo?tokeninfo.userId.toString():null
  }
      async save(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
          await ResetTokenModel.create({userId,tokenHash,expiresAt})
      }
    
    
      

}