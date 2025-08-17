/* eslint-disable @typescript-eslint/naming-convention */
import {
  type Prisma,
  type PrismaClient,
  type SktmMatType,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SKTMComponent = {
  async createComponent(
    data: {
      id_sktm_survey: number;
      id_material: number;
      tipe_material: SktmMatType; // enum or string union
      kuantitas: number; // Decimal → number
      keterangan?: string | null; // nullable & optional
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmComponent.create({
      data: {
        ...data,
      },
    });
  },
  async getAllBySurvey(id_sktm_survey: number, include: boolean = false) {
    return await prisma.sktmComponent.findMany({
      where: { id_sktm_survey },
      include: {
        material: include,
      },
    });
  },
  async getById(id: number, include: boolean = false) {
    return await prisma.sktmComponent.findUnique({
      where: { id },
      include: {
        material: include,
      },
    });
  },
  async getByMaterial(
    id_material: number,
    id_sktm_survey: number | null,
    include: boolean = false,
  ) {
    const where: any = { id_material };

    if (id_sktm_survey != null) {
      where.id_sktm_survey = id_sktm_survey;
    }

    return prisma.sktmComponent.findMany({
      where,
      include: {
        material: include,
      },
    });
  },
  async getByTipe(
    tipe_material: SktmMatType,
    id_sktm_survey?: number | null,
    include: boolean = false,
  ) {
    const where: any = { tipe_material };

    if (id_sktm_survey != null) {
      where.id_sktm_survey = id_sktm_survey;
    }

    return prisma.sktmComponent.findMany({
      where,
      include: {
        material: include,
      },
    });
  },
  async updateComponents(
    id: number,
    data: Partial<{
      id_sktm_survey: number;
      id_material: number;
      tipe_material: SktmMatType; // enum or string union
      kuantitas: number; // Decimal → number
      keterangan?: string | null; // nullable & optional
    }>,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmComponent.update({
      where: { id },
      data,
    });
  },
  async deleteComponents(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmComponent.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  },
};
