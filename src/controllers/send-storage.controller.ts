import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { StorageService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StorageController = {
  async getImage(request: Request, response: Response, next: NextFunction) {
    try {
      const fileName: string = request.params.file_name;
      const isFileValid = await StorageService.imageValidate(fileName);

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
      const fileName: string = request.params.file_name;
      const isFileValid = await StorageService.fileValidate(fileName);

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

  async getExcel(request: Request, response: Response, next: NextFunction) {
    try {
      const fileName: string = request.params.file_name;
      const isFileValid = await StorageService.excelValidate(fileName);

      if (!isFileValid) {
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'failed to find the file',
        );
      }

      return response.sendFile(`storage/excel/${fileName}`, {
        root: '.',
      });
    } catch (error: any) {
      next(error);
    }
  },
};
