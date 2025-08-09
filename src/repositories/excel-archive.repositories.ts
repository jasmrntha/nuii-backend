/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const ExcelArchive = {
  async createData(
    data: {
      file_name: string;
      file_path: string;
      survey_header_id?: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.excelArchive.create({
      data: {
        ...data,
      },
    });
  },

  async getDataBySurveyHeaderId(survey_header_id: number) {
    return await prisma.excelArchive.findMany({
      where: { survey_header_id },
    });
  },
};
