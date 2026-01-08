import { AuthProvider } from "../enums/AuthProvider"
import { UserRole } from "../enums/UserRole"
import { AuthCredentials } from "./AuthCredentials"

export class User{
   private constructor(
    private readonly id:string |null,
    private readonly name:string ,
    private readonly email :string,
    private readonly role:UserRole,
    private readonly auth:AuthCredentials[],
    private blocked :boolean,
    private  phone?:string ,

   ){}

   canLogin():boolean{
    return !this.blocked
   }

   block():void{
    this.blocked = true
   }
   getEmailAuth():AuthCredentials|undefined{
    return this.auth.find(a=>a.isEmail())
   }

   getGoogleAuth():AuthCredentials|undefined{
      return this.auth.find(a=>a.isGoogle())
   }

   hasProvider(provider:AuthProvider):boolean{
      return this.auth.some(a=>a.getProvider()===provider)
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
   if (this.phone) throw new Error("Phone already exists")
   this.phone = phone
 }

 linkGoogleAccount(googleId:string):User{
   if (this.hasProvider(AuthProvider.GOOGLE)) {
      throw new Error("Google account already linked")
    }

    const updatedAuth = [
      ...this.auth,
      AuthCredentials.google(googleId)
    ]

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
 


   static registerWithEmail(name:string,email:string,phone:string,passwordHash:string,role:UserRole.SEEKER |UserRole.HELPER):User{
    return new User(null,name,email,role,[AuthCredentials.email(passwordHash)],false,phone)

   }

   static registerWithGoogle(name:string,email:string,googleId:string,role:UserRole.SEEKER |UserRole.HELPER,phone?:string):User{
    return new User(null,name,email,role,[AuthCredentials.google(googleId)],false,phone)

   }
   static admin(name:string,email:string,phone:string,passwordHash:string,role:UserRole.ADMIN):User{
    return new User(null,name,email,role,[AuthCredentials.email(passwordHash)],false,phone)
   }

   static rehydrate(
      id:string,
      name:string,
      email:string,
      role:UserRole,
      auth:AuthCredentials[],
      blocked:boolean,
      phone?:string
      ):User{
         return new User(id,name,email,role,auth,blocked,phone)
      }
}