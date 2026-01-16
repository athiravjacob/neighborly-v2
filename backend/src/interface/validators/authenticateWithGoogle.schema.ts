import z from "zod";
import { UserRole } from "../../domain/enums/UserRole";

export const authenticateWithGoogleSchema = z.object({
    idToken:z.string(),
    role:z.enum([UserRole.HELPER,UserRole.SEEKER])
})