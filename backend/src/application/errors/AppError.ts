import { AppError as AppErrorShape } from "./ErrorCatalog";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(error: AppErrorShape) {
    super(error.message);
    this.code = error.code;
    this.statusCode = error.statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
