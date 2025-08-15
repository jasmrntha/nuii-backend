/* eslint-disable @typescript-eslint/naming-convention */
import {
  type Prisma,
  type PrismaClient,
  type SurveyType,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

enum MaterialTables {
  CABLE = 'kabelMaterial',
  ACCESSORY = 'accessoryMaterial',
  TERMINATION = 'terminasiMaterial',
  JOINTING = 'jointingMaterial',
}

export const Material = {
  async createMaterial(
    data: {
      id_tipe_material: number;
      nomor_material: number;
      nama_material: string;
      satuan_material: string;
      berat_material: number;
      harga_material: number;
      pasang_rab: number;
      bongkar: number;
      jenis_material: string;
      kategori_material: string;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.material.create({
      data: {
        ...data,
      },
    });
  },

  async updateMaterial(
    id: number,
    data: {
      id_tipe_material: number;
      nomor_material: number;
      nama_material: string;
      satuan_material: string;
      berat_material: number;
      harga_material: number;
      pasang_rab: number;
      bongkar: number;
      jenis_material: string;
      kategori_material: string;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    const date = new Date();

    return await client.material.update({
      where: { id },
      data: {
        ...data,
        updated_at: date,
      },
    });
  },

  async deleteMaterial(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    const date = new Date();

    return await client.material.update({
      where: { id },
      data: {
        deleted_at: date,
      },
    });
  },

  async findMaterialById(id: number) {
    return await prisma.material.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
  },

  async getSelectedMaterial(id_tipe: number) {
    return await prisma.material.findMany({
      where: {
        id_tipe_material: id_tipe,
        deleted_at: null,
      },
    });
  },

  async getAllMaterial() {
    return await prisma.material.findMany({
      where: {
        deleted_at: null,
      },
    });
  },

  async getSurveyMaterials(table: MaterialTables, tipe_survey?: SurveyType) {
    const where: any = {};

    if (tipe_survey) {
      where.tipe_survey = tipe_survey;
    }

    return await (prisma as any)[table].findMany({
      where,
    });
  },
};
