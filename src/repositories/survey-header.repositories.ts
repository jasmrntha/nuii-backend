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
  async findHeaderById(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
        status_survey: SurveyStatus.Belum_Disetujui,
      },
    });
  },
  async exportHeaderById(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
      },
    });
  },
  async findSurveyById(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: { id, status_survey: SurveyStatus.Belum_Disetujui },
      include: {
        SurveySequance: true,
        sutm_surveys: true,
        sktm_surveys: true,
        cubicle_surveys: true,
        app_tm_surveys: true,
      },
    });
  },
  async getSurveyHeader(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
        status_survey: SurveyStatus.Belum_Disetujui,
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

  async getHeaderOnly() {
    return await prisma.surveyHeader.findMany({
      where: {
        status_survey: SurveyStatus.Belum_Disetujui,
      },
    });
  },

  async getAllSurvey() {
    return await prisma.surveyHeader.findMany({
      where: {
        status_survey: SurveyStatus.Belum_Disetujui,
      },
      include: {
        SurveySequance: true,
        sutm_surveys: true,
        sktm_surveys: true,
        cubicle_surveys: true,
        app_tm_surveys: true,
      },
    });
  },

  async getAllReport() {
    return await prisma.surveyHeader.findMany({
      where: {
        status_survey: SurveyStatus.Disetujui,
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

  async getReportById(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
        status_survey: SurveyStatus.Disetujui,
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
};
