/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

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

    const date = new Date();

    return await client.material.create({
      data: {
        ...data,
        created_at: date,
        updated_at: date,
      },
    });
  },

  async updateMaterial(
    id: string,
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
        created_at: date,
        updated_at: date,
      },
    });
  },

  async deleteMaterial(
    id: string,
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

  async findMaterialById(id: string) {
    return await prisma.material.findUnique({
      where: {
        id,
      },
    });
  },
};
