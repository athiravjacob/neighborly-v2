import { SignupRole, UserRole } from "../../../domain/enums/UserRole";
import { IUserRepository } from "../../../domain/entities/user/IUserRepository";
import { User } from "../../../domain/entities/user/User";
import { REFRESH_TOKEN_TTL } from "../../config/auth.config";
import { IGoogleTokenVerifier } from "../../port/IGoogleTokenVerifier";
import { IHasher } from "../../port/IHasher";
import { IJwtServices } from "../../port/IJwtServices";
import { IRefreshTokenRepository } from "../../port/IRefreshTokenRepository";
import { isSignupRole } from "./SignupWithEmailUsecase";

type authenticateWithGoogleInput = {
  idToken: string;
  role: SignupRole;
};

type authenticateWithGoogleOutput = {
  user: { id: string; name: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
};

export class AuthenticateWithGoogleUsecase {
  constructor(
    private userRepo: IUserRepository,
    private googleVerifier: IGoogleTokenVerifier,
    private jwt: IJwtServices,
    private hasher: IHasher,
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute({
    idToken,
    role,
  }: authenticateWithGoogleInput): Promise<authenticateWithGoogleOutput> {
    const payload = await this.googleVerifier.verify(idToken);
    if (!payload) throw new Error("Invalid Google token");

    let user = await this.userRepo.findByGoogleId(payload.googleId);

    if (!user) {
      user = await this.userRepo.findByEmail(payload.email);

      if (user) {
        user.linkGoogleAccount(payload.googleId);
        user = await this.userRepo.save(user);
      } else {
        user = User.registerWithGoogle(
          payload.name,
          payload.email,
          payload.googleId,
          role,
          payload.phone
        );
        user = await this.userRepo.save(user);
      }
    }

    if (user.isBlocked()) {
      throw new Error("Account is blocked");
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.generateAccessToken({
        userId: user.getId(),
        role: user.getRole(),
      }),
      this.jwt.generateRefreshToken({ userId: user.getId() }),
    ]);

    const hashToken = await this.hasher.hash(refreshToken);
    await this.refreshTokenRepository.save({
      userId: user.getId(),
      tokenHash: hashToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    return {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
      },
      accessToken,
      refreshToken,
    };
  }
}
