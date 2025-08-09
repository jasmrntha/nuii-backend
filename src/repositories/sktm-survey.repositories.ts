/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SKTMSurvey = {
  async createSKTM(
    data: {
      id_survey_header: number;
      penyulang: string;
      panjang_jaringan: number;
      diameter_kabel: number; // Decimal maps to number here
      long: string;
      lat: string;
      foto: string;
      keterangan: string;
      petugas_survey: string;
      has_arrester?: boolean; // Optional because Boolean? in Prisma
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmSurvey.create({
      data: {
        ...data,
      },
    });
  },
  async getAllSKTM() {
    return await prisma.sktmSurvey.findMany({
      include: {
        sktm_joints: true,
      },
    });
  },
  async getAllSKTMByHeader(survey_header_id: number) {
    const sequances = await prisma.surveySequance.findMany({
      where: { survey_header_id, tipe: 'SKTM' },
    });

    const details = [];

    for (const sequance of sequances) {
      const id = sequance.survey_detail_id;

      details.push(
        await prisma.sktmSurvey.findUnique({
          where: {
            id,
          },
        }),
      );
    }
  },
  async getDetailSKTM(id: number) {
    return await prisma.sktmSurvey.findUnique({
      where: { id },
      include: {
        sktm_joints: true,
      },
    });
  },
  async updateSKTM(
    id: number,
    data: {
      id_survey_header: number;
      penyulang: string;
      panjang_jaringan: number;
      diameter_kabel: number; // Decimal maps to number here
      long: string;
      lat: string;
      foto: string;
      keterangan: string;
      petugas_survey: string;
      has_arrester?: boolean; // Optional because Boolean? in Prisma
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmSurvey.update({
      where: { id },
      data: {
        ...data,
      },
    });
  },
  async deleteSKTM(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmSurvey.delete({
      where: { id },
    });
  },
};
