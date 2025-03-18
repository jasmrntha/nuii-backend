import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { type RouteRequest } from '../models';
import { EstimasiService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EstimasiController = {
  getEstimasi(request: Request, response: Response, next: NextFunction) {
    try {
      const result = EstimasiService.getEstimasi(request.body as RouteRequest);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Estimation data fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
