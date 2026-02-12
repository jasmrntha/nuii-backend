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
      const rawBody = request.body;
      const body: CreateSUTMDetailRRequest = {
        ...rawBody,
        id_survey_header: rawBody.id_survey_header
          ? Number(rawBody.id_survey_header)
          : undefined,
        id_material_konduktor: rawBody.id_material_konduktor
          ? Number(rawBody.id_material_konduktor)
          : undefined,
        id_sutm_survey: rawBody.id_sutm_survey
          ? Number(rawBody.id_sutm_survey)
          : undefined,
        id_material_tiang: Number(rawBody.id_material_tiang),
        id_konstruksi: Number(rawBody.id_konstruksi),
        id_pole_supporter: Number(rawBody.id_pole_supporter),
        id_grounding_termination: Number(rawBody.id_grounding_termination),
        panjang_jaringan: Number(rawBody.panjang_jaringan),
      };
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
