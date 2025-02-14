import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError, CustomResponse } from '../middleware';
import { UploadImageService } from '../services/upload-image.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UploadImageController = async (
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

    const result = await UploadImageService(request, response);

    const success = new CustomResponse(StatusCodes.OK, 'File uploaded', result);

    return response.json(success.toJSON());
  } catch (error) {
    next(error);
  }
};
