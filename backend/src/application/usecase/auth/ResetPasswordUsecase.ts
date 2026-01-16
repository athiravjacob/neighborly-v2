import { IUserRepository } from "../../../domain/entities/user/IUserRepository";
import { IHasher } from "../../port/IHasher";
import crypto from "crypto"
import { IResetPasswordTokenRepository } from "../../port/IResetPasswordTokenRepository";

type resetPasswordInput = {
  newPassword: string;
  token: string;
};

export class ResetPasswordUsecase {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasher,
    private resetpasswordTokenRepository:IResetPasswordTokenRepository
  ) {}

  async execute(input: resetPasswordInput): Promise<void> {
    const { newPassword, token } = input;
    const newHashPassword = await this.hasher.hash(newPassword);
    const incomingTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const userId = await this.resetpasswordTokenRepository.findByTokenHash(incomingTokenHash)
    if(!userId) throw new Error("Token expired or invalid token")

    const user = await this.userRepository.findById(userId)
    if(!user) throw new Error("User not found")
    const updatedUser = user?.resetPassword(newHashPassword)
    if(!updatedUser) throw new Error("cannot reset password")
    await this.userRepository.save(updatedUser)
    await this.resetpasswordTokenRepository.deleteToken(incomingTokenHash)

    
    
  }
}
