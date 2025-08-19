/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { type SurveyType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import {
  type CreateSUTMDetailRRequest,
  type UpdateSUTMHeaderRRequest,
  type UpdateSUTMDetailRRequest,
} from '../models/sutm';
import { SUTMRepository, SurveyHeader, SurveySequance } from '../repositories';

export const SUTMService = {
  async createSutm(request: CreateSUTMDetailRRequest) {
    try {
      if (request.id_survey_header) {
        const surveyHeader = await SurveyHeader.checkIfHeaderExist(
          request.id_survey_header,
        );

        if (!surveyHeader) {
          throw new CustomError(
            StatusCodes.NOT_FOUND,
            'Survey header not found',
          );
        }
      }

      if (!request.id_sutm_survey) {
        const sutmHeader = await SUTMRepository.createSutmHeader({
          id_survey_header: request.id_survey_header,
          id_material_konduktor: request.id_material_konduktor,
        });

        request.id_sutm_survey = sutmHeader.id;

        const checkSequence = await SurveySequance.getAllSequanceByHeader(
          request.id_survey_header,
        );
        const sequenceData = {
          survey_header_id: request.id_survey_header,
          survey_detail_id: request.id_sutm_survey,
          urutan: checkSequence.length + 1,
          keterangan: 'SUTM',
        };

        await SurveySequance.createSequance('SUTM' as SurveyType, {
          ...sequenceData,
          created_at: new Date(),
        });
      }

      const createdDetail = await SUTMRepository.creatSutmDetail({
        id_material_tiang: request.id_material_tiang,
        id_konstruksi: request.id_konstruksi,
        id_pole_supporter: request.id_pole_supporter,
        id_grounding_termination: request.id_grounding_termination,
        penyulang: request.penyulang,
        panjang_jaringan: request.panjang_jaringan,
        long: request.long,
        lat: request.lat,
        foto: request.foto,
        keterangan: request.keterangan,
        petugas_survey: request.petugas_survey,
        id_sutm_survey: request.id_sutm_survey,
      });

      if (!createdDetail) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to create SUTM detail',
        );
      }

      const header = {
        id_survey_header: request.id_survey_header,
        id_sutm_header: request.id_sutm_survey,
        id_material_konduktor: request.id_material_konduktor,
      };

      return { header, createdDetail };
    } catch (error) {
      throw error;
    }
  },

  async updateSutmHeader(request: UpdateSUTMHeaderRRequest, id: number) {
    try {
      const update = await SUTMRepository.updateSutmHeader(id, request);

      if (!update) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to update SUTM header',
        );
      }

      return update;
    } catch (error) {
      throw error;
    }
  },

  async updateSutmDetail(request: UpdateSUTMDetailRRequest, id: number) {
    try {
      const update = await SUTMRepository.updateSutmDetail(id, request);

      if (!update) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to update SUTM detail',
        );
      }

      return update;
    } catch (error) {
      throw error;
    }
  },

  async deleteSutmDetail(id: number) {
    try {
      const deleted = await SUTMRepository.deleteSutmDetail(id);

      if (!deleted) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to delete SUTM detail',
        );
      }

      return deleted;
    } catch (error) {
      throw error;
    }
  },

  async deleteSutmHeader(id: number) {
    try {
      const deleted = await SUTMRepository.deleteSutmHeader(id);

      if (!deleted) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Failed to delete SUTM header',
        );
      }

      return deleted;
    } catch (error) {
      throw error;
    }
  },

  async getSutmDetailById(id: number) {
    try {
      const getDetail = await SUTMRepository.getSutmDetailById(id);

      if (!getDetail) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'SUTM detail not found');
      }

      return getDetail;
    } catch (error) {
      throw error;
    }
  },

  async getSutmDetailWithHeader(id: number) {
    try {
      const header = await SUTMRepository.getSutmHeaderById(id);
      const detail = await SUTMRepository.getSutmDetailBySurveyId(header.id);

      if (!header || detail.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'SUTM not found');
      }

      return { header, detail };
    } catch (error) {
      throw error;
    }
  },

  async getAllSutm() {
    try {
      return await SUTMRepository.getAll();
    } catch (error) {
      throw error;
    }
  },
};
