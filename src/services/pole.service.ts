import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { PoleRepository } from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PoleService = {
  async getPole() {
    try {
      const getPole = await PoleRepository.getPole();

      if (getPole.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Pole Not Found');
      }

      return getPole;
    } catch (error) {
      throw error;
    }
  },
};
