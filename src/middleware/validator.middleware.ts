import { type Request, type Response, type NextFunction } from 'express';
import type Joi from 'joi';

import { CustomError } from './error.middleware';

export const validate =
  (schema: Joi.Schema) =>
  (request: Request, response: Response, next: NextFunction) => {
    const { error }: { error: Joi.ValidationError } = schema.validate(
      request.body,
      { abortEarly: false },
    );
    const isValid = error == null;

    if (isValid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(index => index.message).join(',');

      return next(new CustomError(422, message));
    }
  };
