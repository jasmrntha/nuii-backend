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
  const rawStatus = error?.status || error?.statusCode || error?.code;

  let errorStatus: number;

  if (Number.isInteger(rawStatus)) {
    errorStatus = rawStatus;
  } else if (Number.isInteger(Number(rawStatus))) {
    errorStatus = Number(rawStatus);
  } else {
    errorStatus = 500;
  }

  const errorMessage = error?.message || 'Internal server error';
  const errorCode = typeof error?.code === 'string' ? error.code : undefined;

  response.status(errorStatus).json({
    status: false,
    code: errorStatus,
    errorCode,
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
