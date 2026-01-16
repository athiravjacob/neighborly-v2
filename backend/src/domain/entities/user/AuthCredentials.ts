import { AuthProvider } from "../../enums/AuthProvider";

export class AuthCredentials {
  private constructor(
    private readonly provider: AuthProvider,
    private readonly passwordHash?: string,
    private readonly googleId?: string
  ) {
    if (provider === AuthProvider.EMAIL && !passwordHash) {
      throw new Error("Email auth requires password");
    }

    if (provider === AuthProvider.GOOGLE && !googleId) {
      throw new Error("Google auth requires googleId");
    }
  }

  static email(passwordHash: string): AuthCredentials {
    if (!passwordHash) throw new Error("Password is required");

    return new AuthCredentials(AuthProvider.EMAIL, passwordHash);
  }

  static google(googleId: string): AuthCredentials {
    if (!googleId) throw new Error("Google id required");

    return new AuthCredentials(AuthProvider.GOOGLE, undefined, googleId);
  }

  isEmail(): boolean {
    return this.provider === AuthProvider.EMAIL;
  }

  isGoogle(): boolean {
    return this.provider === AuthProvider.GOOGLE;
  }

  getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  getGoogleId(): string | undefined {
    return this.googleId;
  }
  getProvider(): AuthProvider {
    return this.provider;
  }
  updatePassword(newPasswordHash: string): AuthCredentials {
    return new AuthCredentials(AuthProvider.EMAIL, newPasswordHash);
  }
}
