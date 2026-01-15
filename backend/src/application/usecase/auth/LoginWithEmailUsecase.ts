import { UserRole } from "../../../domain/enums/UserRole";
import { IUserRepository } from "../../../domain/user/IUserRepository";
import { REFRESH_TOKEN_TTL } from "../../config/auth.config";
import { AppError } from "../../errors/AppError";
import { ErrorCatalog } from "../../errors/ErrorCatalog";
import {  IHasher } from "../../port/IHasher";
import { IJwtServices } from "../../port/IJwtServices";
import { IRefreshTokenRepository } from "../../port/IRefreshTokenRepository";

type LoginWithEmailInput = {
  email: string;
  password: string;
};

type LoginWithEmailOutput = {
  accessToken: string;
  refreshToken: string;
};

export class LoginWithEmailUsecase {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasher,
    private jwtServices: IJwtServices,
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(input: LoginWithEmailInput): Promise<LoginWithEmailOutput> {
    const { email, password } = input;
    
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError(ErrorCatalog.INVALID_CREDENTIALS);

    if (!user.canLogin()) {
      throw new AppError(ErrorCatalog.FORBIDDEN);
    }

    const auth = user.getEmailAuth();
    if (!auth) {
      throw new Error("Email login not available for this account");
    }
    const storedHash = auth.getPasswordHash();

    if (!storedHash) throw new Error("Invalid login method");

    const isValid = await this.hasher.verify(password, storedHash);
    if (!isValid) throw new AppError(ErrorCatalog.INVALID_CREDENTIALS);

    const accessToken = await this.jwtServices.generateAccessToken({
      userId: user.getId(),
      role: user.getRole(),
    });
    const refreshToken = await this.jwtServices.generateRefreshToken({
      userId: user.getId(),
    });
    const hashToken = await this.hasher.hash(refreshToken);
    await this.refreshTokenRepository.save({
      userId: user.getId(),
      tokenHash: hashToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
