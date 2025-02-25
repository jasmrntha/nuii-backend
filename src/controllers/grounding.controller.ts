import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { GroundingService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GroundingController = {
  async getGrounding(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await GroundingService.getGrounding();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Grounding data fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
