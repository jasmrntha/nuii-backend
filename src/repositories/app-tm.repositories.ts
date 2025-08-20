/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

interface ComponentItem {
  nomor_material: number;
  kuantitas: number;
  keterangan?: string;
}

// Default APP & METER components (you can pass your own via args)
const APP_METER_COMPONENTS: ComponentItem[] = [
  { nomor_material: 153, kuantitas: 1, keterangan: '-' },
  { nomor_material: 288, kuantitas: 1, keterangan: '-' },
  { nomor_material: 181, kuantitas: 1, keterangan: '-' },
  { nomor_material: 112, kuantitas: 2, keterangan: '-' },
  { nomor_material: 457, kuantitas: 0, keterangan: '-' },
  { nomor_material: 386, kuantitas: 0, keterangan: '-' },
  { nomor_material: 456, kuantitas: 0, keterangan: '-' },
  { nomor_material: 126, kuantitas: 0, keterangan: '-' },
];

export const AppTmRepository = {
  /**
   * Creates AppTM header and inserts components, then returns header + components (with material_name).
   * Uses explicit `await` for all Prisma calls.
   */
  async createAppTm(
    data: {
      id_survey_header: number;
      keterangan?: string;
      penyulang?: string;
      lat?: string;
      long?: string;
      foto?: string;
      components?: ComponentItem[]; // optional; uses APP_METER_COMPONENTS if omitted
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    const components: ComponentItem[] = (
      data.components ?? APP_METER_COMPONENTS
    )
      .map(c => ({
        nomor_material: Number(c.nomor_material),
        kuantitas: Number(c.kuantitas),
        keterangan: (c.keterangan ?? '-').trim() || '-',
      }))
      .filter(
        c => Number.isFinite(c.nomor_material) && Number.isFinite(c.kuantitas),
      );

    const result = await client.$transaction(async trx => {
      // 1) Header
      const header = await trx.appTmSurvey.create({
        data: {
          id_survey_header: data.id_survey_header,
          keterangan: data.keterangan,
          penyulang: data.penyulang,
          lat: data.lat,
          long: data.long,
          foto: data.foto,
        },
        select: { id: true, id_survey_header: true },
      });

      if (components.length === 0) {
        return { header, components: [] as Array<any> };
      }

      // 2) Resolve material IDs + names
      const nomorList = [...new Set(components.map(c => c.nomor_material))];
      const materials = await trx.material.findMany({
        where: { nomor_material: { in: nomorList } },
        select: { id: true, nomor_material: true, nama_material: true }, // adjust name field if different
      });
      const byNomor = new Map(materials.map(m => [m.nomor_material, m]));

      // 3) Build rows to insert & return payload
      const rowsForInsert: Array<{
        id_apptm_survey: number;
        id_material: number;
        kuantitas: number; // use Prisma.Decimal if your schema is Decimal
        keterangan: string;
      }> = [];

      const componentsForReturn: Array<{
        nomor_material: number;
        id_material: number;
        material_name: string | null;
        kuantitas: number;
        keterangan: string;
      }> = [];

      for (const c of components) {
        const mat = byNomor.get(c.nomor_material);
        if (!mat) continue; // skip unknown material numbers

        rowsForInsert.push({
          id_apptm_survey: header.id,
          id_material: mat.id,
          kuantitas: c.kuantitas,
          keterangan: c.keterangan,
        });

        componentsForReturn.push({
          nomor_material: c.nomor_material,
          id_material: mat.id,
          material_name: mat.nama_material ?? null,
          kuantitas: c.kuantitas,
          keterangan: c.keterangan,
        });
      }

      if (rowsForInsert.length > 0) {
        await trx.appTmComponent.createMany({
          data: rowsForInsert,
          // skipDuplicates: true, // uncomment if you added @@unique([id_app_tm_survey, id_material])
        });
      }

      return { header, components: componentsForReturn };
    });

    return result; // explicit await above; returning the resolved value
  },

  async getComponentById(app_tm_id: number) {
    return await prisma.appTmComponent.findMany({
      where: { id_apptm_survey: app_tm_id, deleted_at: null },
    });
  },

  async getAppTmBySurvey(id_survey: number) {
    return await prisma.appTmSurvey.findMany({
      where: { id_survey_header: id_survey, deleted_at: null },
    });
  },

  async getAppTmById(id: number) {
    return await prisma.appTmSurvey.findUnique({
      where: { id, deleted_at: null },
    });
  },

  async deleteAppTmBySurvey(id_survey: number) {
    const deleteHeader = await prisma.appTmSurvey.updateMany({
      where: { id_survey_header: id_survey },
      data: { deleted_at: new Date() },
    });

    await prisma.appTmComponent.updateMany({
      where: {
        id_apptm_survey: {
          in: await (async () => {
            const headers = await prisma.appTmSurvey.findMany({
              where: { id_survey_header: id_survey },
              select: { id: true },
            });

            return headers.map(h => h.id);
          })(),
        },
      },
      data: { deleted_at: new Date() },
    });

    return deleteHeader;
  },
};
