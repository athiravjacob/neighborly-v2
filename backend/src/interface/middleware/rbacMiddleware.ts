import { Request,Response,NextFunction } from "express";
import { UserRole } from "../../domain/enums/UserRole";

export const RequireRole=(...allowedRoles :UserRole[])=>{
    return(req:Request,res:Response,next:NextFunction)=>{
        if(!req.user){
            return res.status(401).json({
                message: "Unauthorized",
              });     
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
              message: "Forbidden: insufficient permissions",
            });
          }

          next()
    }
}