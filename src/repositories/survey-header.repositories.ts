/* eslint-disable @typescript-eslint/naming-convention */
import {
  type Prisma,
  type PrismaClient,
  type SurveyStatus,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SurveyHeader = {
  async createHeader(
    data: {
      nama_survey: string;
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
      },
    });
  },
  async findSurveyById(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: { id },
      include: {
        survey_details: true,
      },
    });
  },
  async getSurveyHeader(id: number) {
    return await prisma.surveyHeader.findUnique({
      where: {
        id,
        survey_details: {
          some: { deleted_at: null },
        },
      },
    });
  },
  async getSurveyNameList() {
    return await prisma.surveyHeader.findMany({
      where: {
        survey_details: {
          some: { deleted_at: null },
        },
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
        survey_details: {
          some: { deleted_at: null },
        },
      },
    });
  },

  async getAllSurvey() {
    return await prisma.surveyHeader.findMany({
      where: {
        survey_details: {
          some: { deleted_at: null },
        },
      },
      include: {
        survey_details: true,
      },
    });
  },

  async deleteSurvey(id: number) {
    return await prisma.surveyDetail.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },
};
