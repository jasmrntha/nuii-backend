/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { type NextFunction, type Request, type Response } from 'express';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const errorStatus = error.code || 500;
  const errorMessage = error.message || 'Internal server error';

  response.status(errorStatus).json({
    status: false,
    code: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? error.stack : {},
  });
};

export class CustomError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
