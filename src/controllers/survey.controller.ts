import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import {
  type CreateSurveyRequest,
  type CreateNewSurveyRequest,
} from '../models';
import { SurveyService } from '../services';
// import { tokenDecode } from '../utils/JwtToken';
// import { storageQueryValidate } from '../validators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SurveyController = {
  async createSurvey(request: Request, response: Response, next: NextFunction) {
    try {
      console.log(request);

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
      console.log(request);

      const requestBody = request.body as CreateNewSurveyRequest;

      const result = await SurveyService.createNewSurvey(requestBody);

      const resp = new CustomResponse(StatusCodes.OK, 'Survey created', result);

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
