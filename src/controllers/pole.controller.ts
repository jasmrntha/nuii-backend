import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { PoleService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PoleController = {
  async getPole(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await PoleService.getPole();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Pole data fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
