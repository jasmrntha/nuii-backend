/* eslint-disable @typescript-eslint/naming-convention */
import { type Prisma, type PrismaClient } from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library';

import prisma from '../config/prisma';

export const SKTMSurvey = {
  async createSurvey(
    data: {
      id_survey_header: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmSurvey.create({
      data: {
        ...data,
      },
    });
  },
  async getAll(include: boolean = false) {
    return await prisma.sktmSurvey.findMany({
      include: {
        sktm_details: include,
        sktm_joints: include,
        sktm_components: include,
      },
    });
  },
  async getAllByHeader(survey_header_id: number, include: boolean = false) {
    const sequances = await prisma.surveySequance.findMany({
      where: { survey_header_id, tipe: 'SKTM' },
    });

    const details = [];

    for (const sequance of sequances) {
      const id = sequance.survey_detail_id;

      details.push(
        await prisma.sktmSurvey.findUnique({
          where: {
            id,
          },
          include: {
            sktm_details: include,
            sktm_joints: include,
            sktm_components: include,
          },
        }),
      );
    }

    return details;
  },
  async getById(id: number, include: boolean = false) {
    return await prisma.sktmSurvey.findUnique({
      where: { id },
      include: {
        sktm_details: include,
        sktm_joints: include,
        sktm_components: include,
      },
    });
  },
  async updateSurvey(
    id: number,
    data: {
      id_survey_header: number;
    },
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$on' | '$disconnect' | '$use' | '$transaction' | '$extends'
    >,
  ) {
    const client = tx || prisma;

    return await client.sktmSurvey.update({
      where: { id },
      data: {
        ...data,
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

    await client.sktmDetail.updateMany({
      where: { id_sktm_survey: id },
      data: { deleted_at: date },
    });
    await client.sktmComponent.updateMany({
      where: { id_sktm_survey: id },
      data: { deleted_at: date },
    });
    await client.sktmJoint.updateMany({
      where: { id_sktm_survey: id },
      data: { deleted_at: date },
    });

    return await client.sktmSurvey.update({
      where: { id },
      data: {
        deleted_at: date,
      },
    });
  },
};
