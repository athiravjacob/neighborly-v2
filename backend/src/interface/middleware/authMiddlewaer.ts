import {Request,Response, NextFunction } from "express"
import { UserRole } from "../../domain/enums/UserRole"
import { auth } from "google-auth-library"
import jwt from "jsonwebtoken"
interface JwtPayload{
    userId:string,
    role:UserRole
}

export const authenticateJwt=(req:Request,res:Response,next:NextFunction)=>{
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "Authorization token missing",
              });
        }

        const token = authHeader.split(" ")[1]
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
        }
        if (!token) {
            throw new Error("Invalid Token");
            }
        const decoded = jwt.verify(
            token,
            jwtSecret
        )

        if (
            typeof decoded !== "object" ||
            !("userId" in decoded) ||
            !("role" in decoded)
          ) {
            return res.status(401).json({ message: "Invalid token payload" });
          }

        req.user = {
            id: decoded.userId as string,
            role: decoded.role as UserRole,
          };
          next()
    } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });

    }
}