import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import {
  type CreateMaterialRequest,
  type UpdateMaterialRequest,
} from '../models';
import { MaterialService } from '../services';
// import { tokenDecode } from '../utils/JwtToken';
// import { storageQueryValidate } from '../validators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MaterialController = {
  async createMaterial(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const requestBody = request.body as CreateMaterialRequest;

      const result = await MaterialService.createMaterial(requestBody);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Material created',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async updateMaterial(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const requestBody = request.body as UpdateMaterialRequest;
      const { id } = request.params;

      const result = await MaterialService.updateMaterial(
        Number(id),
        requestBody,
      );

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Material updated',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async deleteMaterial(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      const result = await MaterialService.deleteMaterial(Number(id));

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Material deleted',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getTiang(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await MaterialService.getSelectedMaterial(2);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Material listed as Tiang found.',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getKonduktor(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await MaterialService.getSelectedMaterial(3);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Material listed as Konduktor found.',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },

  async getAllMaterial(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const result = await MaterialService.getAllMaterial();

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Material listed',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
