import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { StorageService } from '../services';
import { tokenDecode } from '../utils/JwtToken';
import { storageQueryValidate } from '../validators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StorageController = {
  async getImage(request: Request, response: Response, next: NextFunction) {
    try {
      const userToken = request.query;
      const { error, value } = storageQueryValidate.validate(userToken, {
        abortEarly: false,
      });

      if (error) {
        const { details } = error;
        const message = details.map(index => index.message).join(',');

        throw new CustomError(422, message);
      }

      const user = tokenDecode(value.token as string);

      if (user.role !== 'ADMIN' && user.role !== 'USER') {
        throw new CustomError(
          StatusCodes.UNAUTHORIZED,
          'account role did not have permissions',
        );
      }

      const fileName: string = request.params.file_name;
      const isFileValid = await StorageService.fileValidate(fileName);

      if (!isFileValid) {
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'failed to find the image',
        );
      }

      return response.sendFile(`storage/file/${fileName}`, {
        root: '.',
      });
    } catch (error: any) {
      next(error);
    }
  },

  async getFile(request: Request, response: Response, next: NextFunction) {
    try {
      const userToken = request.query;
      const { error, value } = storageQueryValidate.validate(userToken, {
        abortEarly: false,
      });

      if (error) {
        const { details } = error;
        const message = details.map(index => index.message).join(',');

        throw new CustomError(422, message);
      }

      const user = tokenDecode(value.token as string);

      if (user.role !== 'ADMIN' && user.role !== 'USER') {
        throw new CustomError(
          StatusCodes.UNAUTHORIZED,
          'account role did not have permissions',
        );
      }

      const fileName: string = request.params.file_name;
      const isFileValid = await StorageService.imageValidate(fileName);

      if (!isFileValid) {
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'failed to find the file',
        );
      }

      return response.sendFile(`storage/file/${fileName}`, {
        root: '.',
      });
    } catch (error: any) {
      next(error);
    }
  },
};
