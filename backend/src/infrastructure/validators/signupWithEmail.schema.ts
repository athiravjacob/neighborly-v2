import { z } from "zod";

export const signupWithEmailSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SEEKER", "HELPER"])
});
