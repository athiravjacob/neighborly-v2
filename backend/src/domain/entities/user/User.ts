import { AuthProvider } from "../../enums/AuthProvider";
import { UserRole } from "../../enums/UserRole";
import { AuthCredentials } from "./AuthCredentials";

export class User {
  private constructor(
    private readonly id: string | null,
    private readonly name: string,
    private readonly email: string,
    private readonly role: UserRole,
    private readonly auth: AuthCredentials[],
    private blocked: boolean,
    private phone?: string
  ) {}

  canLogin(): boolean {
    return !this.blocked;
  }

  block(): void {
    this.blocked = true;
  }
  hasId(): boolean {
   return this.id !== null;
 }
  getEmailAuth(): AuthCredentials | undefined {
    return this.auth.find((a) => a.isEmail());
  }

  getGoogleAuth(): AuthCredentials | undefined {
    return this.auth.find((a) => a.isGoogle());
  }

  hasProvider(provider: AuthProvider): boolean {
    return this.auth.some((a) => a.getProvider() === provider);
  }

  getName(): string {
    return this.name;
  }

  getId(): string {
    if (!this.id) {
      throw new Error("User not persisted yet");
    }
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): UserRole {
    return this.role;
  }
  addPhoneNumber(phone: string) {
    if (this.phone) throw new Error("Phone already exists");
    this.phone = phone;
  }

  getAuth(): AuthCredentials[] {
    return [...this.auth];
  }

  isBlocked(): boolean {
    return this.blocked;
  }

  getPhone(): string | undefined {
    return this.phone;
  }

  linkGoogleAccount(googleId: string): User {
    if (this.hasProvider(AuthProvider.GOOGLE)) {
      throw new Error("Google account already linked");
    }

    const updatedAuth = [...this.auth, AuthCredentials.google(googleId)];

    return new User(
      this.id,
      this.name,
      this.email,
      this.role,
      updatedAuth,
      this.blocked,
      this.phone
    );
  }

  canResetPassword(): boolean {
    if (this.isBlocked()) return false;
    return this.hasProvider(AuthProvider.EMAIL);
  }

  static registerWithEmail(
    name: string,
    email: string,
    phone: string,
    passwordHash: string,
    role: UserRole.SEEKER | UserRole.HELPER
  ): User {
    return new User(
      null,
      name,
      email,
      role,
      [AuthCredentials.email(passwordHash)],
      false,
      phone
    );
  }

  static registerWithGoogle(
    name: string,
    email: string,
    googleId: string,
    role: UserRole.SEEKER | UserRole.HELPER,
    phone?: string
  ): User {
    return new User(
      null,
      name,
      email,
      role,
      [AuthCredentials.google(googleId)],
      false,
      phone
    );
  }
  static admin(
    name: string,
    email: string,
    phone: string,
    passwordHash: string,
    role: UserRole.ADMIN
  ): User {
    return new User(
      null,
      name,
      email,
      role,
      [AuthCredentials.email(passwordHash)],
      false,
      phone
    );
  }

  static rehydrate(
    id: string,
    name: string,
    email: string,
    role: UserRole,
    auth: AuthCredentials[],
    blocked: boolean,
    phone?: string
  ): User {
    return new User(id, name, email, role, auth, blocked, phone);
  }

  resetPassword(newPasswordHash: string): User {
    if (this.isBlocked())
      throw new Error("Cannot change password. User Blocked");
    if (!this.hasProvider(AuthProvider.EMAIL))
      throw new Error("This account can't change password");

    const updatedAuth = this.auth.map((auth) =>
      auth.isEmail() ? auth.updatePassword(newPasswordHash) : auth
    );
    return new User(
      this.id,
      this.name,
      this.email,
      this.role,
      updatedAuth,
      this.blocked,
      this.phone
    );
  }
}
