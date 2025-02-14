import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { MailService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MailerController = {
  async verificationMail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      await MailService.sendVerificationMail(request.body.email);
      const result = new CustomResponse(StatusCodes.OK, 'Email sended');

      return response.status(StatusCodes.OK).json(result.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async resendVerificationEmail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      await MailService.resendVerifyEmail(request.body.email);
      const result = new CustomResponse(StatusCodes.OK, 'Email sended');

      return response.status(StatusCodes.OK).json(result.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },

  async emailVerify(request: Request, response: Response, next: NextFunction) {
    try {
      await MailService.emailVerify(request.params.mailToken);
      const result = new CustomResponse(StatusCodes.OK, 'Email verified');

      return response.status(StatusCodes.OK).json(result.toJSON());
    } catch (error: any) {
      return next(error);
    }
  },
};
