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

        if (checkSequence.length === 0) {
          await SurveySequance.createSequance('SUTM' as SurveyType, {
            ...sequenceData,
            created_at: new Date(),
          });
        }
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
      return await SUTMRepository.updateSutmHeader(id, request);
    } catch (error) {
      throw error;
    }
  },

  async updateSutmDetail(request: UpdateSUTMDetailRRequest, id: number) {
    try {
      return await SUTMRepository.updateSutmDetail(id, request);
    } catch (error) {
      throw error;
    }
  },

  async deleteSutmDetail(id: number) {
    try {
      return await SUTMRepository.deleteSutmDetail(id);
    } catch (error) {
      throw error;
    }
  },

  async deleteSutmHeader(id: number) {
    try {
      return await SUTMRepository.deleteSutmHeader(id);
    } catch (error) {
      throw error;
    }
  },

  async getSutmDetailById(id: number) {
    try {
      return await SUTMRepository.getSutmDetailById(id);
    } catch (error) {
      throw error;
    }
  },

  async getSutmDetailWithHeader(id: number) {
    try {
      const header = await SUTMRepository.getSutmHeaderById(id);
      const detail = await SUTMRepository.getSutmDetailBySurveyId(header.id);

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
