import { AuthProvider } from "../../../domain/enums/AuthProvider";
import { IUserRepository } from "../../../domain/entities/user/IUserRepository";
import { IEmailService } from "../../port/IEmailService";
import { IResetPasswordTokenRepository } from "../../port/IResetPasswordTokenRepository";
import crypto from "crypto";

type forgotPasswordOutput = { messsage: string; token: string };

export class ForgotPasswordUsecase {
  constructor(
    private userRepository: IUserRepository,
    private resetPasswordTokenRepository: IResetPasswordTokenRepository,
    private emailService:IEmailService,
    private frontendBaseUrl: string
  ) {}

  async execute(email: string): Promise<forgotPasswordOutput> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (!user.canResetPassword())
      throw new Error("Account blocked, you cannot reset password");

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");  
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    this.resetPasswordTokenRepository.save(user.getId(), tokenHash, expiresAt);
    const resetLink = `${this.frontendBaseUrl}/reset-password?token=${token}`;
    await this.emailService.sendResetPasswordEmail(user.getEmail(),resetLink)

    return {
      messsage: "Reset link sent to the email",
      token,
    };
  }
}
