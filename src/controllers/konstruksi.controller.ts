import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { KonstruksiService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const KonstruksiController = {
  async getAllKonstruksi(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const result = await KonstruksiService.getAllKonstruksi();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Konstruksi fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
