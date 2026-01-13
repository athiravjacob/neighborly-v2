import { z } from "zod";
import {UserRole} from '../../domain/enums/UserRole'
export const signupWithEmailSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone:z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(6),
  role: z.enum([UserRole.SEEKER,UserRole.HELPER])
});
