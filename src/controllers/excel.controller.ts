import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
import { type UploadExcelRequest } from '../models';
import { ExcelService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ExcelController = {
  async uploadExcel(request: Request, response: Response, next: NextFunction) {
    try {
      const body = request.body as UploadExcelRequest;
      const result = await ExcelService.uploadExcel(body);

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Excel data uploaded successfully',
        result,
      );

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
