import { domainToASCII } from "url";
import { IUserRepository } from "../../../../domain/entities/user/IUserRepository";
import { User } from "../../../../domain/entities/user/User";
import { IAuthCredentials, UserModel } from "../schemas/UserSchema";
import { AuthProvider } from "../../../../domain/enums/AuthProvider";
import { AuthCredentials } from "../../../../domain/entities/user/AuthCredentials";
import { UserRole } from "../../../../domain/enums/UserRole";

export class UserRepositoryMongo implements IUserRepository {
  async save(user: User): Promise<User> {
    const data:{
      name:string,
      email:string,
      role:UserRole,
      blocked:boolean,
      auth:Array< { provider: AuthProvider.EMAIL; passwordHash: string } |    
      { provider: AuthProvider.GOOGLE; googleId: string }
      >,
      phone?:string
    }={
      name:user.getName(),
      email:user.getEmail(),
      role:user.getRole(),
      blocked:user.isBlocked(),
      auth:user.getAuth().map(a=>a.isEmail()?{ provider: AuthProvider.EMAIL, passwordHash: a.getPasswordHash()! }
      : { provider: AuthProvider.GOOGLE, googleId: a.getGoogleId()! })
    }

    if (user.getPhone()!== undefined) {
      data.phone = user.getPhone()!; 
    }

    let doc 
    if(user.hasId()){
      let userId = user.getId()!
      doc = await UserModel.findByIdAndUpdate({userId},data,{new:true})
      if (!doc) {
        throw new Error("User not found for update");
      }
    }else{
      doc = await UserModel.create(data)
    }

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
  );
}

  

  async findById(userId: string): Promise<User | null> {
    try {
      const doc = await UserModel.findOne({ _id:userId });
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
      console.error("Error in UserRepository.findbyid:", error);
      throw new Error("Failed to fetch user by email");
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
      const doc = await UserModel.findOne({ "auth.googleId": googleId });
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
      console.error("Error in UserRepository.findByGoogleId:", error);
      throw new Error("Failed to fetch user by googleId");
    }
  }
}
