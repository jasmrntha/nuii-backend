/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/naming-convention */
import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import {
  UpdateSUTMDetailRRequest,
  UpdateSUTMHeaderRRequest,
  type CreateSUTMDetailRRequest,
} from '../models';
import { SUTMService } from '../services';

export const SUTMController = {
  async createSutm(request: Request, response: Response, next: NextFunction) {
    try {
      const body = request.body as CreateSUTMDetailRRequest;
      const result = await SUTMService.createSutm(body);

      const responseData = {
        header: result.header,
        detail: result.createdDetail,
      };
      const resp = new CustomResponse(
        StatusCodes.OK,
        'SUTM Survey created',
        responseData,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async updateSutmHeader(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const body = request.body as UpdateSUTMHeaderRRequest;
      const { id } = request.params;
      const result = await SUTMService.updateSutmHeader(body, Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'SUTM Survey updated',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async updateSutmDetail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const body = request.body as UpdateSUTMDetailRRequest;
      const { id } = request.params;
      const result = await SUTMService.updateSutmDetail(body, Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'SUTM Survey updated',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getSutmByHeader(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      const result = await SUTMService.getSutmDetailWithHeader(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'SUTM Survey fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getSutmById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const result = await SUTMService.getSutmDetailById(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'SUTM Detail fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async deleteSutmDetail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      await SUTMService.deleteSutmDetail(Number(id));

      const resp = new CustomResponse(StatusCodes.OK, 'SUTM Detail deleted');

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async deleteSutmHeader(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      await SUTMService.deleteSutmHeader(Number(id));

      const resp = new CustomResponse(StatusCodes.OK, 'SUTM Header deleted');

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getAllSutm(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await SUTMService.getAllSutm();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'All SUTM fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
