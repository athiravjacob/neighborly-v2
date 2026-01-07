import { UserRole } from "../enums/UserRole"
import { AuthCredentials } from "./AuthCredentials"

export class User{
   private constructor(
    private readonly id:string |null,
    private readonly name:string ,
    private readonly email :string,
    private readonly role:UserRole,
    private auth:AuthCredentials,
    private blocked :boolean,
    private  phone?:string ,

   ){}

   canLogin():boolean{
    return !this.blocked
   }

   block():void{
    this.blocked = true
   }
   getAuth():AuthCredentials{
    return this.auth
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
   const updatedAuth=this.auth.linkGoogle(googleId)
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
    return new User(null,name,email,role,AuthCredentials.email(passwordHash),false,phone)

   }

   static registerWithGoogle(name:string,email:string,googleId:string,role:UserRole.SEEKER |UserRole.HELPER,phone?:string):User{
    return new User(null,name,email,role,AuthCredentials.google(googleId),false,phone)

   }
   static admin(name:string,email:string,phone:string,passwordHash:string,role:UserRole.ADMIN):User{
    return new User(null,name,email,role,AuthCredentials.email(passwordHash),false,phone)
   }
}