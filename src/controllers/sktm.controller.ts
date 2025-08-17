import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  type UpdateSKTMDetailRequest,
  type CreateSKTMDetailRequest,
} from 'models';

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

  async updateSurvey(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = (await request.body) as UpdateSKTMDetailRequest;

      const result = await SKTMService.UpdateSKTM(payload);

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

  async deleteSurvey(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      await SKTMService.deleteEntity('survey', Number(id));

      const resp = new CustomResponse(StatusCodes.OK, 'Survey deleted');

      return response.json(resp.toJSON());
    } catch (error) {
      next(error);
    }
  },

  async deleteDetail(request: Request, response: Response, next: NextFunction) {
    try {
      const { id, detailId } = request.params;
      await SKTMService.deleteEntity('detail', Number(id), Number(detailId));

      const resp = new CustomResponse(StatusCodes.OK, 'Detail deleted');

      return response.json(resp.toJSON());
    } catch (error) {
      next(error);
    }
  },

  async deleteComponent(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id, componentId } = request.params;
      await SKTMService.deleteEntity(
        'component',
        Number(id),
        Number(componentId),
      );

      const resp = new CustomResponse(StatusCodes.OK, 'Component deleted');

      return response.json(resp.toJSON());
    } catch (error) {
      next(error);
    }
  },

  async deleteJoint(request: Request, response: Response, next: NextFunction) {
    try {
      const { id, jointId } = request.params;
      await SKTMService.deleteEntity('joint', Number(id), Number(jointId));

      const resp = new CustomResponse(StatusCodes.OK, 'Joint deleted');

      return response.json(resp.toJSON());
    } catch (error) {
      next(error);
    }
  },
};
