import { UserRole } from "../../../domain/enums/UserRole";
import { IUserRepository } from "../../../domain/user/IUserRepository";
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
    //move to infrastructure/config/jwt later
    const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    if (!user.canLogin()) {
      throw new Error("You are blocked by the admin");
    }

    const auth = user.getEmailAuth();
    if (!auth) {
      throw new Error("Email login not available for this account");
    }
    const storedHash = auth.getPasswordHash();

    if (!storedHash) throw new Error("Invalid login method");

    const isValid = await this.hasher.verify(password, storedHash);
    if (!isValid) throw new Error("Invalid credentials");

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
