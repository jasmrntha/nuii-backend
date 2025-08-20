/* eslint-disable @typescript-eslint/naming-convention */
import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { type UpdateCubicle, type CreateCubicle } from '../models/cubicle';
import { CubicleService } from '../services';

export const CubicleController = {
  async createCubicle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const data = request.body as CreateCubicle;
      const result = await CubicleService.createCubicle(data);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Cubicle is successfully created',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async updateCubicle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const body = request.body as UpdateCubicle;
      const { id } = request.params;

      const updated = await CubicleService.updateCubicle(Number(id), body);
      const resp = new CustomResponse(
        StatusCodes.OK,
        'Cubicle is successfully updated',
        updated,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getCubicleById(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      const cubicle = await CubicleService.getCubicleDetail(Number(id));
      const resp = new CustomResponse(
        StatusCodes.OK,
        'Cubicle retrieved successfully',
        cubicle,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getCubicleBySurveyId(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      const cubicle = await CubicleService.getCubicleBySurveyHeader(Number(id));
      const resp = new CustomResponse(
        StatusCodes.OK,
        'Cubicle retrieved successfully',
        cubicle,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async deleteCubicle(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      const deleted = await CubicleService.deleteCubicle(Number(id));
      const resp = new CustomResponse(StatusCodes.OK, deleted.message, null);

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getApptmbySurvey(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      const appTm = await CubicleService.getAppTmBySurvey(Number(id));
      const resp = new CustomResponse(
        StatusCodes.OK,
        'App TM retrieved successfully',
        appTm,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getAppTmById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const appTm = await CubicleService.getApptmById(Number(id));
      const resp = new CustomResponse(
        StatusCodes.OK,
        'App TM retrieved successfully',
        appTm,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
