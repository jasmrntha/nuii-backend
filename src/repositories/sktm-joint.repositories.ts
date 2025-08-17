/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SKTMJoint = {
  async createJoint(
    data: {
      id_sktm_survey: number;
      id_material_kabel: number;
      id_material_joint: number;
      lat: string;
      long: string;
      urutan: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmJoint.create({
      data: {
        ...data,
      },
    });
  },
  async getAllBySurvey(id_sktm_survey: number, include: boolean = false) {
    return await prisma.sktmJoint.findMany({
      where: { id_sktm_survey },
      include: {
        material_joint: include,
        material_kabel: include,
      },
    });
  },
  async getById(id: number, include: boolean = false) {
    return await prisma.sktmJoint.findUnique({
      where: { id },
      include: {
        material_joint: include,
        material_kabel: include,
      },
    });
  },
  async updateJoint(
    id: number,
    data: Partial<{
      id_sktm_survey: number;
      id_material_kabel: number;
      id_material_joint: number;
      lat: string;
      long: string;
      urutan: number;
    }>,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmJoint.update({
      where: { id },
      data, // only the provided fields will be updated
    });
  },
  async deleteJoint(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmJoint.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  },
  async getMaxUrutan(id_sktm_survey: number) {
    const result = await prisma.sktmJoint.findFirst({
      where: { id_sktm_survey },
      orderBy: { urutan: 'desc' },
      select: { urutan: true },
    });

    return result?.urutan ?? 0;
  },
};
