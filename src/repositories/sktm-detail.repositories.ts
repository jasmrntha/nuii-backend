/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SKTMDetail = {
  async createDetail(
    data: {
      id_sktm_survey: number;
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

    return await client.sktmDetail.create({
      data: {
        ...data,
      },
    });
  },
  async getAllBySurvey(id_sktm_survey: number) {
    return await prisma.sktmDetail.findMany({
      where: { id_sktm_survey },
    });
  },
  async getById(id: number) {
    return await prisma.sktmDetail.findUnique({
      where: { id },
    });
  },
  async updateDetail(
    id: number,
    data: Partial<{
      penyulang: string;
      panjang_jaringan: number;
      diameter_kabel: number; // Decimal maps to number here
      long: string;
      lat: string;
      foto: string;
      keterangan: string;
      petugas_survey: string;
      has_arrester?: boolean; // Optional because Boolean? in Prisma
    }>,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmDetail.update({
      where: { id },
      data,
    });
  },
  async deleteDetail(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmDetail.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  },
};
