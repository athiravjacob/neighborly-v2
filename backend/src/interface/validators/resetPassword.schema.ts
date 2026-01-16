import z from "zod";

export const resetPasswordSchema = z.object({
    newPassword:z.string()
})