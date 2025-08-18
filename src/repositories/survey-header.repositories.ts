/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyStatus, type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SurveyHeader = {
  async createHeader(
    data: {
      nama_survey: string;
      nama_pekerjaan: string;
      lokasi: string;
      user_id: string;
      status_survey: SurveyStatus;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.surveyHeader.create({
      data: {
        ...data,
      },
    });
  },

  async updateHeader(
    id: number,
    data: {
      nama_survey: string;
      nama_pekerjaan: string;
      lokasi: string;
      user_id: string;
      status_survey: SurveyStatus;
      id_material_konduktor: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.surveyHeader.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },

  async getById(id: number, status?: SurveyStatus, include: boolean = false) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
        ...(status ? { status_survey: status } : {}),
      },
      include: {
        SurveySequance: include,
        sutm_surveys: include,
        sktm_surveys: include,
        cubicle_surveys: include,
        app_tm_surveys: include,
      },
    });
  },

  async getDeep(id: number, status?: SurveyStatus, include: boolean = false) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
        ...(status ? { status_survey: status } : {}),
      },
      include: {
        SurveySequance: include,
        sutm_surveys: {
          include: {
            sutm_details: {
              include: {
                material_tiang: include,
                konstruksi: {
                  include: {
                    konstruksi_materials: { include: { material: include } },
                  },
                },
                pole_supporter: {
                  include: {
                    pole_materials: { include: { material: include } },
                  },
                },
                grounding_termination: {
                  include: {
                    GroundingMaterial: { include: { material: include } },
                  },
                },
              },
            },
            material_konduktor: include,
          },
        },
        sktm_surveys: {
          include: {
            sktm_details: include,
            sktm_components: include,
            sktm_joints: include,
          },
        },
        cubicle_surveys: include,
        app_tm_surveys: include,
      },
    });
  },

  async getSurveyNameList() {
    return await prisma.surveyHeader.findMany({
      where: {
        status_survey: SurveyStatus.Belum_Disetujui,
      },
      select: {
        id: true,
        nama_survey: true,
      },
    });
  },

  async getAll(status?: SurveyStatus, include: boolean = false) {
    return await prisma.surveyHeader.findMany({
      where: {
        ...(status ? { status_survey: status } : {}),
      },
      include: {
        SurveySequance: include,
        sutm_surveys: include,
        sktm_surveys: include,
        cubicle_surveys: include,
        app_tm_surveys: include,
      },
    });
  },

  async getAllReportWithExcel() {
    return await prisma.surveyHeader.findMany({
      where: {
        status_survey: SurveyStatus.Disetujui,
      },
      include: {
        excel_archive: true,
      },
    });
  },

  async createHeaderEstimasi(
    data: {
      nama_survey: string;
      nama_pekerjaan: string;
      lokasi: string;
      user_id: string;
      id_material_konduktor: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.surveyHeader.create({
      data: {
        ...data,
        status_survey: SurveyStatus.Belum_Disetujui,
      },
    });
  },

  async deleteSurvey(
    id: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    const date = new Date();

    return await client.surveyHeader.update({
      where: { id },
      data: { deleted_at: date },
    });
  },

  async checkIfHeaderExist(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: { id },
    });
  },
};
