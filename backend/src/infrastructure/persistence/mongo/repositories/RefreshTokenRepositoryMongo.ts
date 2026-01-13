import { IRefreshTokenRepository } from "../../../../application/port/IRefreshTokenRepository";
import { RefreshTokenModel } from "../schemas/RefreshTokenSchema";

export  class RefreshTokenRepositoryMongo implements IRefreshTokenRepository{
    async save(input:{userId:string, tokenHash:string, expiresAt:Date }) {
        const { userId, tokenHash, expiresAt } = input;
        await RefreshTokenModel.findOneAndUpdate(
          { userId },
          { tokenHash, expiresAt },
          { upsert: true }
        );
      }
    
      async findByUserId(userId: string) {
        return RefreshTokenModel.findOne({ userId }).lean();
      }
    
      async deleteByUserId(userId: string) {
        await RefreshTokenModel.deleteOne({ userId });
      }

}