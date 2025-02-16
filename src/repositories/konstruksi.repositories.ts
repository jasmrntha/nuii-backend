/* eslint-disable @typescript-eslint/naming-convention */
// import { type Prisma, type PrismaClient } from '@prisma/client';
// import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const Konstruksi = {
  async findKonstruksiById(id: number) {
    return await prisma.konstruksi.findUnique({
      where: {
        id,
      },
    });
  },
};
