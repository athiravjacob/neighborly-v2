import { domainToASCII } from "url";
import { IUserRepository } from "../../../../domain/user/IUserRepository";
import { User } from "../../../../domain/user/User";
import { IAuthCredentials, UserModel } from "../schemas/UserSchema";
import { AuthProvider } from "../../../../domain/enums/AuthProvider";
import { AuthCredentials } from "../../../../domain/user/AuthCredentials";

export class UserRepositoryMongo implements IUserRepository {
  async save(user: User): Promise<User> {
      try {
        const phone = user.getPhone()

        const doc = await UserModel.create({
          name: user.getName(),
          email: user.getEmail(),
          role: user.getRole(),
          blocked: user.isBlocked(),
          auth: user.getAuth().map(a => {
            if (a.isEmail()) {
              return {
                provider: AuthProvider.EMAIL,
                passwordHash: a.getPasswordHash()!,
              }
            }
        
            return {
              provider: AuthProvider.GOOGLE,
              googleId: a.getGoogleId()!,
            }
          }),
          ...(phone && { phone }),
        })
        

        return User.rehydrate(
            doc.id,
            doc.name,
            doc.email,
            doc.role,
            doc.auth.map(a =>
              a.provider === AuthProvider.EMAIL
                ? AuthCredentials.email(a.passwordHash!)
                : AuthCredentials.google(a.googleId!)
            ),
            doc.blocked,
            doc.phone
          )
       

      } catch (error) {
        console.error("Error in UserRepository.save:", error);
      throw new Error("Failed to create new user ");
      }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const doc = await UserModel.findOne({ email });
      if (!doc) return null;

      return User.rehydrate(
        doc._id.toString(),
        doc.name,
        doc.email,
        doc.role,
        doc.auth.map((a) =>
          a.provider === AuthProvider.EMAIL
            ? AuthCredentials.email(a.passwordHash!)
            : AuthCredentials.google(a.googleId!)
        ),
        doc.blocked,
        doc.phone
      );
    } catch (error) {
      console.error("Error in UserRepository.findByEmail:", error);
      throw new Error("Failed to fetch user by email");
    }
  }
  async findByGoogleId(googleId: string): Promise<User | null> {
try {
    const doc = await UserModel.findOne({"auth.googleId":googleId})
    if(!doc) return null

    return User.rehydrate(
        doc._id.toString(),
        doc.name,
        doc.email,
        doc.role,
        doc.auth.map((a) =>
        a.provider === AuthProvider.EMAIL
          ? AuthCredentials.email(a.passwordHash!)
          : AuthCredentials.google(a.googleId!)
      ),
      doc.blocked,
      doc.phone      );

    
} catch (error) {
    console.error("Error in UserRepository.findByGoogleId:", error);
    throw new Error("Failed to fetch user by googleId");
}  }
 
}