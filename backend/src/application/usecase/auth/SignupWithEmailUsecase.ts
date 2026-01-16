import { SignupRole, UserRole } from "../../../domain/enums/UserRole";
import { IUserRepository } from "../../../domain/entities/user/IUserRepository";
import { User } from "../../../domain/entities/user/User";
import { AppError } from "../../errors/AppError";
import { ErrorCatalog } from "../../errors/ErrorCatalog";
import { IHasher } from "../../port/IHasher";

type SignupWithEmailInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: SignupRole;
};

type SignupWithEmailOutput = {
  id: string;
  email: string;
  role: SignupRole;
};

export function isSignupRole(role: UserRole): role is SignupRole {
  return role === UserRole.HELPER || role === UserRole.SEEKER;
}

export class SignupWithEmailUsecase {
  constructor(
    private userRepository: IUserRepository,
    private hashPassword: IHasher
  ) {}

  async execute(input: SignupWithEmailInput): Promise<SignupWithEmailOutput> {
    const { name, email, phone, password, role } = input;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(ErrorCatalog.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await this.hashPassword.hash(password);
    const user = User.registerWithEmail(name, email, phone, passwordHash, role);
    const savedUser = await this.userRepository.save(user);
    return {
      id: savedUser.getId(),
      email,
      role,
    };
  }
}
