/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient, type LogType } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const Logging = {
  async createLog(
    type: LogType,
    data: {
      id_material: number;
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

    return await client.logging.create({
      data: {
        tipe_log: type,
        ...data,
        created_at: date,
      },
    });
  },
};
