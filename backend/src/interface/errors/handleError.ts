import { ZodError } from "zod";
import { ErrorCatalog } from "../../application/errors/ErrorCatalog";
import { AppError } from "../../application/errors/AppError";
import { Response } from "express";

export function handleError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      code: ErrorCatalog.VALIDATION_FAILED.code,
      message: ErrorCatalog.VALIDATION_FAILED.message,
      details: error.issues
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      code: error.code,
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong"
  });
}
