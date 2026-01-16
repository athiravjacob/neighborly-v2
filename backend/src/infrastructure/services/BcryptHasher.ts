import { IHasher } from "../../application/port/IHasher";
import bcrypt from "bcryptjs";

export class BcryptHasher implements IHasher {
  verify(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain,hash)
  }
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
