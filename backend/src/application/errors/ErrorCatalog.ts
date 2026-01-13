export const ErrorCatalog = {
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "Email already exists",
    statusCode: 409
  },

  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password",
    statusCode: 401
  },

  VALIDATION_FAILED: {
    code: "VALIDATION_FAILED",
    message: "Validation failed",
    statusCode: 400
  },
  
} as const;

export type ErrorKey = keyof typeof ErrorCatalog;
export type AppError = typeof ErrorCatalog[ErrorKey];
