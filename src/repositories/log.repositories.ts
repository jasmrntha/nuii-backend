/* eslint-disable @typescript-eslint/naming-convention */
// import { type Prisma, type PrismaClient } from '@prisma/client';
// import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const LogRepository = {
  async getLog() {
    return await prisma.logging.findMany();
  },
};
