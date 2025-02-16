import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import {
  type CreateSurveyRequest,
  type CreateNewSurveyRequest,
  type UpdateSurveyHeaderRequest,
  type UpdateSurveyDetailRequest,
} from '../models';
import { SurveyService } from '../services';
// import { tokenDecode } from '../utils/JwtToken';
// import { storageQueryValidate } from '../validators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SurveyController = {
  async createSurvey(request: Request, response: Response, next: NextFunction) {
    try {
      const requestBody = request.body as CreateSurveyRequest;

      const result = await SurveyService.createSurvey(requestBody);

      const resp = new CustomResponse(StatusCodes.OK, 'Survey created', result);

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async createNewSurvey(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const requestBody = request.body as CreateNewSurveyRequest;

      const result = await SurveyService.createNewSurvey(requestBody);

      const resp = new CustomResponse(StatusCodes.OK, 'Survey created', result);

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async updateSurveyHeader(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const requestBody = request.body as UpdateSurveyHeaderRequest;

      const result = await SurveyService.updateSurveyHeader(requestBody);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey Header updated',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async updateSurveyDetail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const requestBody = request.body as UpdateSurveyDetailRequest;

      const result = await SurveyService.updateSurveyDetail(requestBody);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey Detail updated',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async exportSurvey(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const result = await SurveyService.exportSurvey(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey exported',
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

      const result = await SurveyService.deleteSurvey(Number(id));

      const resp = new CustomResponse(StatusCodes.OK, 'Survey deleted', result);

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async deleteSurveyDetail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      const result = await SurveyService.deleteSurveyDetail(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey Detail deleted',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getSurveyNameList(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const result = await SurveyService.getSurveyNameList();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey Name List',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getHeaderOnly(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const result = await SurveyService.getAllSurveyHeader();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey Header List',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getSurveyDetail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const id = request.params.id;
      const result = await SurveyService.getSurveyDetail(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Survey Detail Fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getAllReport(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await SurveyService.getAllReport();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Report Header List',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
  async getReportDetail(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const id = request.params.id;
      const result = await SurveyService.getReportDetail(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Report Detail Fetched',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
