import { ZodSchema } from "zod";

export function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}
