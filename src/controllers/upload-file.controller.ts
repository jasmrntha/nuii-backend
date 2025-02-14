import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError, CustomResponse } from '../middleware';
import { UploadFileService } from '../services/upload-file.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UploadFileController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const file = request.file;

    if (!file) {
      const error = new CustomError(
        StatusCodes.BAD_REQUEST,
        'No file uploaded',
      );

      return response.json(error);
    }

    const result = await UploadFileService(request, response);

    const success = new CustomResponse(StatusCodes.OK, 'File uploaded', result);

    return response.json(success.toJSON());
  } catch (error) {
    next(error);
  }
};
