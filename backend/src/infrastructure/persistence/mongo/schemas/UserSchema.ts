import mongoose, { Document, Schema } from "mongoose";
import { AuthProvider } from "../../../../domain/enums/AuthProvider";
import { UserRole } from "../../../../domain/enums/UserRole";
import { timeStamp } from "console";

export interface IAuthCredentials{
    provider:AuthProvider,
    passwordHash?:string,
    googleId?:string
}

export interface IUserDocument extends Document{
    name:string,
    email:string,
    role:UserRole,
    blocked:boolean,
    auth:IAuthCredentials[],
    phone?:string,
    createdAt:Date,
    updatedAt:Date
}

const AuthCredentialsSchema = new Schema<IAuthCredentials>({
    provider:{type:String,required:true,enum:Object.values(AuthProvider)},
    passwordHash:{
        type:String, 
        required :function(this:IAuthCredentials){
            return this.provider === AuthProvider.EMAIL
        }},
    googleId:{
        type:String,
        required :function(this:IAuthCredentials){
            return this.provider === AuthProvider.GOOGLE
        }
    }
},{_id:false})

const UserSchema = new Schema<IUserDocument>({
    name:{type:String,required:true},
    email:{type:String,required:true},
    role:{type:String,required:true ,enum:Object.values(UserRole)},
    blocked:{type:Boolean,default:false},
    auth:{type:[AuthCredentialsSchema],required:true},
    phone:{type:String},

}, { timestamps: true })

export const UserModel = mongoose.model<IUserDocument>("User",UserSchema)