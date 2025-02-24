/* eslint-disable @typescript-eslint/naming-convention */

import prisma from '../config/prisma';

export const PoleRepository = {
  async getPole() {
    return await prisma.poleSupporter.findMany({
      select: {
        id: true,
        nama_pole: true,
      },
    });
  },
};
