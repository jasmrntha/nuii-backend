import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { GroundingRepository } from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GroundingService = {
  async getGrounding() {
    try {
      const getGrounding = await GroundingRepository.getGrounding();

      if (getGrounding.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Grounding Not Found');
      }

      return getGrounding;
    } catch (error) {
      throw error;
    }
  },
};
