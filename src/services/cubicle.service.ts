/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { type SurveyType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { type CreateCubicle, type UpdateCubicle } from '../models/cubicle';
import {
  CubicleRepository,
  SurveyHeader,
  SurveySequance,
  AppTmRepository,
} from '../repositories';

export const CubicleService = {
  async createCubicle(data: CreateCubicle) {
    try {
      const createCubicle = await CubicleRepository.createCubicle({
        ...data,
      });

      if (!createCubicle) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to create cubicle',
        );
      }

      const checkSequence = await SurveySequance.getAllSequanceByHeader(
        data.id_survey_header,
      );

      const sequenceData = {
        survey_header_id: data.id_survey_header,
        survey_detail_id: createCubicle.id,
        urutan: checkSequence.length + 1,
        keterangan: 'CUBICLE',
      };

      await SurveySequance.createSequance('CUBICLE' as SurveyType, {
        ...sequenceData,
        created_at: new Date(),
      });

      const createAppTm = await AppTmRepository.createAppTm({
        id_survey_header: data.id_survey_header,
      });

      if (!createAppTm) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to create App TM',
        );
      }

      const checkSequence2 = await SurveySequance.getAllSequanceByHeader(
        data.id_survey_header,
      );

      const sequenceData2 = {
        survey_header_id: data.id_survey_header,
        survey_detail_id: createAppTm.header.id,
        urutan: checkSequence2.length + 1,
        keterangan: 'APP_TM',
      };

      await SurveySequance.createSequance('APP_TM' as SurveyType, {
        ...sequenceData2,
        created_at: new Date(),
      });

      const getGroundingData = await CubicleRepository.getCubicleGrounding();

      let cubicleResponse;

      if (data.has_grounding === true) {
        cubicleResponse = {
          ...createCubicle,
          grounding: getGroundingData,
        };
      }

      return { cubicle: cubicleResponse || createCubicle, appTm: createAppTm };
    } catch (error) {
      throw error;
    }
  },

  async updateCubicle(id: number, data: UpdateCubicle) {
    try {
      const updateCubicle = await CubicleRepository.updateCubicle(id, {
        ...data,
      });

      if (!updateCubicle) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to update cubicle',
        );
      }

      const getGroundingData = await CubicleRepository.getCubicleGrounding();

      let cubicleResponse;

      if (data.has_grounding === true) {
        cubicleResponse = {
          ...updateCubicle,
          grounding: getGroundingData,
        };
      }

      return cubicleResponse || updateCubicle;
    } catch (error) {
      throw error;
    }
  },

  async getCubicleDetail(id: number) {
    try {
      const getCubicle = await CubicleRepository.getCubicleById(id);

      if (!getCubicle) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Cubicle not found');
      }

      const getGroundingData = await CubicleRepository.getCubicleGrounding();

      let cubicleResponse;

      if (getCubicle.has_grounding === true) {
        cubicleResponse = {
          ...getCubicle,
          grounding: getGroundingData,
        };
      }

      return cubicleResponse || getCubicle;
    } catch (error) {
      throw error;
    }
  },

  async getCubicleBySurveyHeader(id_survey: number) {
    try {
      const getCubicle =
        await CubicleRepository.getCubicleBySurveyId(id_survey);

      if (getCubicle.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Cubicle not found');
      }

      return getCubicle;
    } catch (error) {
      throw error;
    }
  },

  async deleteCubicle(id: number) {
    try {
      const deleted = await CubicleRepository.deleteCubicle(id);

      if (!deleted) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to delete cubicle',
        );
      }

      const deleteAppTm = await AppTmRepository.deleteAppTmBySurvey(
        deleted.id_survey_header,
      );

      if (!deleteAppTm) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to delete App TM',
        );
      }

      return { message: 'Cubicle and App TM deleted successfully' };
    } catch (error) {
      throw error;
    }
  },

  async getAppTmBySurvey(id_survey_header: number) {
    try {
      const headers = await AppTmRepository.getAppTmBySurvey(id_survey_header);

      if (!headers || headers.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'App TM not found');
      }

      const componentsPerHeader = await Promise.all(
        headers.map(h => AppTmRepository.getComponentById(h.id)),
      );

      // [{ header_id, components }, ...]
      const result = headers.map((h, index) => ({
        header_id: h.id,
        components: componentsPerHeader[index],
      }));

      return result;
    } catch (error) {
      throw error;
    }
  },

  async getApptmById(id: number) {
    try {
      const header = await AppTmRepository.getAppTmById(id);

      if (!header) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'App TM not found');
      }

      const components = await AppTmRepository.getComponentById(header.id);

      // { header_id, components }
      return {
        header_id: header.id,
        components,
      };
    } catch (error) {
      throw error;
    }
  },
};
