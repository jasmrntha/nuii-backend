/* eslint-disable @typescript-eslint/naming-convention */
import {
  type Prisma,
  type PrismaClient,
  type SurveyStatus,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SurveyHeader = {
  async createHeader(
    data: {
      nama_survey: string;
      lokasi: string;
      user_id: string;
      status_survey: SurveyStatus;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    // const date = new Date();

    return await client.surveyHeader.create({
      data: {
        ...data,
      },
    });
  },

  async updateHeader(
    id: string,
    data: {
      nama_survey: string;
      lokasi: string;
      user_id: string;
      status_survey: SurveyStatus;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    // const date = new Date();

    return await client.surveyHeader.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
  async findHeaderById(id: string) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
      },
    });
  },
};
