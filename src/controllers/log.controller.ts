import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { LogService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LogController = {
  async getLog(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await LogService.getLog();

      const resp = new CustomResponse(StatusCodes.OK, 'Log fetched', result);

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
