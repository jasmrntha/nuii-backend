/* eslint-disable @typescript-eslint/require-await */

import fs from 'node:fs';

import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StorageService = {
  async imageValidate(fileName: string) {
    try {
      const isFileExist = fs.existsSync(`./storage/file/${fileName}`);

      if (!isFileExist) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'image does not exist');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  async fileValidate(fileName: string) {
    try {
      const isFileExist = fs.existsSync(`./storage/file/${fileName}`);

      if (!isFileExist) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'file does not exist');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  async excelValidate(fileName: string) {
    try {
      const isFileExist = fs.existsSync(`./storage/excel/${fileName}`);

      if (!isFileExist) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'excel does not exist');
      }

      return true;
    } catch (error) {
      throw error;
    }
  },
};
