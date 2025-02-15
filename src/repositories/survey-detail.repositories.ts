/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SurveyDetail = {
  async createDetail(
    data: {
      id_material_tiang: string;
      id_material_konduktor: string;
      id_konstruksi: string;
      id_header: string;
      nama_pekerjaan: string;
      penyulang: string;
      panjang_jaringan: bigint;
      long: string;
      lat: string;
      foto: string;
      keterangan: string;
      petugas_survey: string;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    // const date = new Date();

    return await client.surveyDetail.create({
      data: {
        ...data,
      },
    });
  },

  async updateDetail(
    id: string,
    data: {
      id_material_tiang: string;
      id_material_konduktor: string;
      id_konstruksi: string;
      id_header: string;
      nama_pekerjaan: string;
      penyulang: string;
      panjang_jaringan: bigint;
      long: string;
      lat: string;
      foto: string;
      keterangan: string;
      petugas_survey: string;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    // const date = new Date();

    return await client.surveyDetail.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
};
