import { getAuth } from '@clerk/express';
import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(request);

    if (!auth || !auth.userId) {
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized Access, Please Login',
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
