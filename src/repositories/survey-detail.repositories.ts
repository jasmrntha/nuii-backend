/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SurveyDetail = {
  async createDetail(
    data: {
      id_material_tiang: number;
      id_material_konduktor: number;
      id_konstruksi: number;
      id_header: number;
      nama_pekerjaan: string;
      penyulang: string;
      panjang_jaringan: number;
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

    return await client.surveyDetail.create({
      data: {
        ...data,
      },
    });
  },

  async updateDetail(
    id: number,
    data: {
      id_material_tiang: number;
      id_material_konduktor: number;
      id_konstruksi: number;
      id_header: number;
      nama_pekerjaan: string;
      penyulang: string;
      panjang_jaringan: number;
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

    return await client.surveyDetail.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
  async findDetailById(id: number) {
    return await prisma.surveyDetail.findUnique({
      where: {
        id,
      },
    });
  },
  async deleteDetail(id: number) {
    return await prisma.surveyDetail.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },
  async detailByHeaderId(id: number) {
    return await prisma.surveyDetail.findMany({
      where: {
        id_header: id,
        deleted_at: null,
      },
    });
  },
};
