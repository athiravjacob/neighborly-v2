import { UserRole } from "../enums/UserRole"
import { AuthCredentials } from "./AuthCredentials"

export class User{
   private constructor(
    private readonly id:string |null,
    private readonly name:string ,
    private readonly email :string,
    private readonly phone :string,
    private readonly role:UserRole,
    private readonly auth:AuthCredentials,
    private blocked :boolean
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

   static registerWithEmail(name:string,email:string,phone:string,passwordHash:string,role:UserRole.SEEKER |UserRole.HELPER):User{
    return new User(null,name,email,phone,role,AuthCredentials.email(passwordHash),false)

   }

   static registerWithGoogle(name:string,email:string,phone:string,googleId:string,role:UserRole.SEEKER |UserRole.HELPER):User{
    return new User(null,name,email,phone,role,AuthCredentials.google(googleId),false)

   }
   static admin(name:string,email:string,phone:string,passwordHash:string,role:UserRole.ADMIN):User{
    return new User(null,name,email,phone,role,AuthCredentials.email(passwordHash),false)
   }
}