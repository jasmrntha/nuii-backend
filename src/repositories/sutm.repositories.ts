/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SUTMRepository = {
  async createSutmHeader(
    data: {
      id_survey_header: number;
      id_material_konduktor?: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sutmSurvey.create({
      data: {
        id_survey_header: data.id_survey_header,
        id_material_konduktor: data.id_material_konduktor,
      },
    });
  },

  async creatSutmDetail(
    data: {
      id_material_tiang: number;
      id_konstruksi: number;
      id_pole_supporter?: number;
      id_grounding_termination?: number;
      penyulang: string;
      panjang_jaringan: number;
      long: string;
      lat: string;
      foto: string;
      keterangan: string;
      petugas_survey: string;
      id_sutm_survey?: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sutmDetail.create({
      data: {
        id_material_tiang: data.id_material_tiang,
        id_konstruksi: data.id_konstruksi,
        id_pole_supporter: data.id_pole_supporter,
        id_grounding_termination: data.id_grounding_termination,
        id_sutm_survey: data.id_sutm_survey,
        penyulang: data.penyulang,
        panjang_jaringan: data.panjang_jaringan,
        long: data.long,
        lat: data.lat,
        foto: data.foto,
        keterangan: data.keterangan,
        petugas_survey: data.petugas_survey,
      },
    });
  },

  async getSutmDetailById(id: number) {
    return await prisma.sutmDetail.findUnique({
      where: {
        id,
      },
    });
  },

  async getSutmDetailBySurveyId(id_survey: number) {
    return await prisma.sutmDetail.findMany({
      where: {
        id_sutm_survey: id_survey,
      },
    });
  },

  async updateSutmHeader(
    id: number,
    data: {
      id_material_konduktor?: number;
    },
  ) {
    return await prisma.sutmSurvey.update({
      where: {
        id,
      },
      data,
    });
  },

  async updateSutmDetail(
    id: number,
    data: {
      id_material_tiang?: number;
      id_konstruksi?: number;
      id_pole_supporter?: number;
      id_grounding_termination?: number;
      penyulang?: string;
      panjang_jaringan?: number | string;
      long?: string | number;
      lat?: string | number;
      foto?: string;
      keterangan?: string;
      petugas_survey?: string;
    },
  ) {
    const updateData: Prisma.SutmDetailUpdateInput = {
      ...(data.penyulang !== undefined && {
        penyulang: String(data.penyulang),
      }),
      ...(data.panjang_jaringan !== undefined && {
        panjang_jaringan: Number(data.panjang_jaringan),
      }),
      ...(data.long !== undefined && { long: String(data.long) }),
      ...(data.lat !== undefined && { lat: String(data.lat) }),
      ...(data.foto !== undefined && { foto: String(data.foto) }),
      ...(data.keterangan !== undefined && {
        keterangan: String(data.keterangan),
      }),
      ...(data.petugas_survey !== undefined && {
        petugas_survey: String(data.petugas_survey),
      }),
      ...(data.id_material_tiang !== undefined && {
        material_tiang: { connect: { id: Number(data.id_material_tiang) } },
      }),
      ...(data.id_konstruksi !== undefined && {
        konstruksi: { connect: { id: Number(data.id_konstruksi) } },
      }),
      ...(data.id_pole_supporter !== undefined && {
        pole_supporter: { connect: { id: Number(data.id_pole_supporter) } },
      }),
      ...(data.id_grounding_termination !== undefined && {
        grounding_termination: {
          connect: { id: Number(data.id_grounding_termination) },
        },
      }),
    };

    if (
      'panjang_jaringan' in updateData &&
      Number.isNaN((updateData as any).panjang_jaringan)
    ) {
      throw new Error('panjang_jaringan must be a number');
    }

    return prisma.sutmDetail.update({
      where: { id: Number(id) },
      data: updateData,
    });
  },

  async deleteSutmHeader(id: number) {
    const deleteDetails = await prisma.sutmDetail.deleteMany({
      where: {
        id_sutm_survey: id,
      },
    });

    return await prisma.sutmSurvey.delete({
      where: {
        id,
      },
    });
  },

  async deleteSutmDetail(id: number) {
    return await prisma.sutmDetail.delete({
      where: {
        id,
      },
    });
  },

  async getSutmHeaderById(id: number) {
    return await prisma.sutmSurvey.findUnique({
      where: {
        id,
      },
    });
  },

  async getAll() {
    const headers = await prisma.sutmSurvey.findMany({
      include: {
        sutm_details: true,
      },
    });

    return headers;
  },
};
