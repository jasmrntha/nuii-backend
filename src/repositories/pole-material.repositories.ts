/* eslint-disable @typescript-eslint/naming-convention */

import prisma from '../config/prisma';

export const PoleMaterialRepository = {
  async getPoleMaterialsByPoleId(id_pole_supporter: number) {
    return await prisma.poleMaterial.findMany({
      where: {
        id_pole_supporter,
      },
    });
  },
};
