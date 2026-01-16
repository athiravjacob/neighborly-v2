import { UserRole } from "../../domain/enums/UserRole";

export interface IJwtServices {
  generateAccessToken(payload: {
    userId: string;
    role: UserRole;
  }): Promise<string>;
  generateRefreshToken(payload: { userId: string }): Promise<string>;
}