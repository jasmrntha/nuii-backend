import { type Role } from '@prisma/client';
import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from './error.middleware';

export interface IRequestUser extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    is_email_verified: boolean;
    created_at: Date;
    updated_at: Date;
  };
}

export const isAllowedRoles =
  (allowedRoles: Role[]) =>
  (request: IRequestUser, response: Response, next: NextFunction) => {
    const role = request.user?.role as Role;

    // Check if the user's role is in the allowed roles array
    if (!allowedRoles.includes(role)) {
      return next(
        new CustomError(
          StatusCodes.UNAUTHORIZED,
          'You are not authorized to access this route',
        ),
      );
    }

    return next();
  };
