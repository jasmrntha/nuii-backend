/* eslint-disable @typescript-eslint/naming-convention */
import {
  type Prisma,
  type PrismaClient,
  type SurveyType,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SurveySequance = {
  async createSequance(
    tipe: SurveyType,
    data: {
      survey_header_id: number;
      survey_detail_id?: number | null; // optional & nullable
      urutan: number;
      keterangan?: string | null; // optional & nullable
      created_at: Date;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.surveySequance.create({
      data: {
        tipe,
        ...data,
      },
    });
  },
  async getAllSequance() {
    return await prisma.surveySequance.findMany({});
  },
  async getAllSequanceByHeader(survey_header_id: number) {
    return await prisma.surveySequance.findMany({
      where: { survey_header_id },
      orderBy: {
        urutan: 'asc',
      },
    });
  },
  async getDetailSequance(id: number) {
    return await prisma.surveySequance.findUnique({
      where: { id },
    });
  },
  async updateSequance(
    id: number,
    data: {
      survey_header_id: number;
      survey_detail_id?: number | null; // optional & nullable
      urutan: number;
      tipe: SurveyType;
      keterangan?: string | null; // optional & nullable
      created_at: Date;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.surveySequance.update({
      where: { id },
      data: {
        ...data,
      },
    });
  },
  async deleteSequance(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.surveySequance.delete({
      where: { id },
    });
  },
};
