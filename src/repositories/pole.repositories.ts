/* eslint-disable @typescript-eslint/naming-convention */

import prisma from '../config/prisma';

export const PoleRepository = {
  async getPole() {
    return await prisma.poleSupporter.findMany({
      where: {
        pole_materials: { some: {} }, // Only get poles that have related records in PoleMaterial
      },
      select: {
        id: true,
        nama_pole: true,
      },
    });
  },

  async getPoleById(id: number) {
    return await prisma.poleSupporter.findUnique({
      where: {
        id,
      },
    });
  },
};
