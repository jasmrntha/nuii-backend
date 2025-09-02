/* eslint-disable @typescript-eslint/naming-convention */

import prisma from '../config/prisma';

export const GroundingRepository = {
  async getGrounding() {
    return await prisma.groundingTermination.findMany({
      select: {
        id: true,
        nama_grounding: true,
      },
    });
  },

  async getGroundingById(id: number, deep: boolean = false) {
    return await prisma.groundingTermination.findUnique({
      where: {
        id,
      },
      include: {
        GroundingMaterial: { include: { material: deep } },
      },
    });
  },
};
