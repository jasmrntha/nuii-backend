/* eslint-disable @typescript-eslint/naming-convention */

import prisma from '../config/prisma';

export const GroundingMaterialRepository = {
  async getGroundingMaterialsByGroundingId(id_grounding_termination: number) {
    return await prisma.groundingMaterial.findMany({
      where: {
        id_grounding_termination,
      },
    });
  },

  async getGroudingById(id: number) {
    return await prisma.groundingTermination.findUnique({
      where: {
        id,
      },
    });
  },
};
