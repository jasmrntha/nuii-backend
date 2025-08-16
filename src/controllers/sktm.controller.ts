import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type CreateSKTMDetailRequest } from 'models';

import { CustomResponse } from '../middleware';
import { SKTMService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SKTMController = {
  async getAll(_: Request, response: Response, next: NextFunction) {
    try {
      const result = await SKTMService.getAllSKTM();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'SKTM Survey fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const result = await SKTMService.getSKTM(Number(id), true);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'SKTM Survey fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async createDetail(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = (await request.body) as CreateSKTMDetailRequest;

      const result = await SKTMService.createDetail(payload);

      const resp = new CustomResponse(
        StatusCodes.CREATED,
        'SKTM Detail created',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
