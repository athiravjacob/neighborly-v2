import  "express";
import { UserRole } from "../../domain/enums/UserRole";

declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string;
                role:UserRole
            }
        }
    }
}