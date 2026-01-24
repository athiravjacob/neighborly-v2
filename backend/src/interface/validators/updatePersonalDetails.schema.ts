import { z } from "zod";

export const updatePersonalDetailsSchema = z
  .object({
    dob: z
  .string()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "dob must be a valid date string",
  })
  .optional()
  .transform((val) => (val ? new Date(val) : undefined)),

    address: z
      .object({
        line1: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        pincode: z.string().regex(/^\d{6}$/),
      })
      .optional(),
  })
  .refine(
    (data) => data.dob !== undefined || data.address !== undefined,
    {
      message: "At least one field must be provided",
    }
  );
