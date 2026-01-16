export interface IRefreshTokenRepository{
    save(input: {
        userId: string;
        tokenHash: string;
        expiresAt: Date;
      }): Promise<void>;
    
      findByUserId(userId: string): Promise<{
        tokenHash: string;
        expiresAt: Date;
      } | null>;
    
      deleteByUserId(userId: string): Promise<void>;
}