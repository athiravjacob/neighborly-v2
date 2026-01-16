import z from "zod";

export const loginWithEmailSchema = z.object({
    email:z.string().email(),
    password:z.string()
})