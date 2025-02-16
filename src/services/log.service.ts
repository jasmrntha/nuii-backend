import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { LogRepository } from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LogService = {
  async getLog() {
    try {
      const result = await LogRepository.getLog();

      if (!result) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Log Not Found');
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};
