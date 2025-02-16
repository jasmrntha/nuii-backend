import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { Konstruksi } from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const KonstruksiService = {
  async getAllKonstruksi() {
    try {
      const result = await Konstruksi.getAllKonstruksi();

      if (!result) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};
