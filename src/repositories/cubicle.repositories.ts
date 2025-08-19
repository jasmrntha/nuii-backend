/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import {
  type CubicleType,
  type Prisma,
  type PrismaClient,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const CubicleRepository = {
  async createCubicle(
    data: {
      has_grounding: boolean;
      id_cubicle_material?: number;
      cubicle_type?: CubicleType;
      penyulang: string;
      long: string;
      lat: string;
      foto: string;
      keterangan?: string;
      petugas_survey: string;
      id_survey_header: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    const DEFAULT_MATERIAL_ID = 67;
    const DEFAULT_TYPE: CubicleType = 'Incoming';
    const DEFAULT_KET = 'Tidak ada keterangan';

    const headerId = Number(data.id_survey_header);
    if (Number.isNaN(headerId))
      throw new Error('id_survey_header must be a number');

    const materialId = Number(data.id_cubicle_material ?? DEFAULT_MATERIAL_ID);

    return client.cubicleSurvey.create({
      data: {
        has_grounding: !!data.has_grounding,
        id_cubicle_material: materialId,
        cubicle_type: data.cubicle_type ?? DEFAULT_TYPE,
        penyulang: String(data.penyulang),
        long: String(data.long),
        lat: String(data.lat),
        foto: String(data.foto),
        keterangan: data.keterangan?.trim() || DEFAULT_KET,
        petugas_survey: String(data.petugas_survey),
        id_survey_header: headerId,
      },
    });
  },
  async updateCubicle(
    id: number,
    data: {
      has_grounding?: boolean;
      id_cubicle_material?: number; // optional
      cubicle_type?: CubicleType; // optional
      penyulang?: string;
      long?: string | number;
      lat?: string | number;
      foto?: string;
      keterangan?: string | null; // allow empty -> default text
      petugas_survey?: string;
      id_survey_header?: number | string; // optional
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;
    const DEFAULT_KET = 'Tidak ada keterangan';

    const updateData: Prisma.CubicleSurveyUncheckedUpdateInput = {
      ...(data.has_grounding !== undefined && {
        has_grounding: !!data.has_grounding,
      }),
      ...(data.id_cubicle_material !== undefined && {
        id_cubicle_material: Number(data.id_cubicle_material),
      }),
      ...(data.cubicle_type !== undefined && {
        cubicle_type: data.cubicle_type,
      }),
      ...(data.penyulang !== undefined && {
        penyulang: String(data.penyulang),
      }),
      ...(data.long !== undefined && { long: String(data.long) }), // use parseFloat if numeric in schema
      ...(data.lat !== undefined && { lat: String(data.lat) }), // use parseFloat if numeric in schema
      ...(data.foto !== undefined && { foto: String(data.foto) }),
      ...(data.keterangan !== undefined && {
        // if provided as empty string/null => fallback to default text
        keterangan: (data.keterangan ?? '').toString().trim() || DEFAULT_KET,
      }),
      ...(data.petugas_survey !== undefined && {
        petugas_survey: String(data.petugas_survey),
      }),
      ...(data.id_survey_header !== undefined && {
        id_survey_header: Number(data.id_survey_header),
      }),
    };

    return client.cubicleSurvey.update({
      where: { id },
      data: updateData,
    });
  },
  async getCubicleBySurveyId(surveyId: number) {
    return prisma.cubicleSurvey.findMany({
      where: { id_survey_header: surveyId, deleted_at: null },
    });
  },
  async getCubicleById(id: number) {
    return prisma.cubicleSurvey.findUnique({
      where: { id, deleted_at: null },
    });
  },
  async getCubicleGrounding() {
    return prisma.groundingMaterial.findMany({
      where: { tipe_survey: 'CUBICLE' },
      select: {
        id_material: true,
        kuantitas: true,
      },
    });
  },
  async deleteCubicle(id: number) {
    return prisma.cubicleSurvey.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },
};
