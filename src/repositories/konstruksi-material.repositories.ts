/* eslint-disable @typescript-eslint/naming-convention */
// import { type Prisma, type PrismaClient } from '@prisma/client';
// import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const KonstruksiMaterial = {
  async findMaterialForKonstruksiById(
    id_konstruksi: number,
    include: boolean = false,
  ) {
    return await prisma.konstruksiMaterial.findMany({
      where: {
        id_konstruksi,
      },
      include: {
        material: include,
      },
    });
  },
};
