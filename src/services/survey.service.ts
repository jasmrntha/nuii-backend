import { StatusCodes } from 'http-status-codes';

import prisma from '../config/prisma';
import { CustomError } from '../middleware';
import {
  type CreateNewSurveyRequest,
  type CreateSurveyRequest,
} from '../models';
import {
  SurveyHeader,
  SurveyDetail,
  Material,
  Konstruksi,
} from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SurveyService = {
  async createSurvey(request: CreateSurveyRequest) {
    try {
      const header = await SurveyHeader.findHeaderById(request.id_header);

      if (!header) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Header Not Found');
      }

      const konstruksi = await Konstruksi.findKonstruksiById(
        request.detail.id_konstruksi,
      );

      if (!konstruksi) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
      }

      const tiang = await Material.findMaterialById(
        request.detail.id_material_tiang,
      );

      const konduktor = await Material.findMaterialById(
        request.detail.id_material_konduktor,
      );

      if (!tiang || !konduktor) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { detail } = await prisma.$transaction(async prisma => {
        const detail = await SurveyDetail.createDetail(
          {
            id_material_tiang: request.detail.id_material_tiang,
            id_material_konduktor: request.detail.id_material_konduktor,
            id_konstruksi: request.detail.id_konstruksi,
            id_header: request.id_header,
            nama_pekerjaan: request.detail.nama_pekerjaan,
            penyulang: request.detail.penyulang,
            panjang_jaringan: request.detail.panjang_jaringan,
            long: request.detail.long,
            lat: request.detail.lat,
            foto: request.detail.foto,
            keterangan: request.detail.keterangan,
            petugas_survey: request.detail.petugas_survey,
          },
          prisma,
        );

        return { detail };
      });

      const result = {
        header: header,
        detail: detail,
      };

      return result;
    } catch (error) {
      throw error;
    }
  },
  async createNewSurvey(request: CreateNewSurveyRequest) {
    try {
      const konstruksi = await Konstruksi.findKonstruksiById(
        request.detail.id_konstruksi,
      );

      if (!konstruksi) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
      }

      const tiang = await Material.findMaterialById(
        request.detail.id_material_tiang,
      );

      const konduktor = await Material.findMaterialById(
        request.detail.id_material_konduktor,
      );

      if (!tiang || !konduktor) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { header, detail } = await prisma.$transaction(async prisma => {
        const header = await SurveyHeader.createHeader(
          {
            nama_survey: request.header.nama_survey,
            lokasi: request.header.lokasi,
            user_id: request.header.user_id,
            status_survey: request.header.status_survey,
          },
          prisma,
        );

        const detail = await SurveyDetail.createDetail(
          {
            id_material_tiang: request.detail.id_material_tiang,
            id_material_konduktor: request.detail.id_material_konduktor,
            id_konstruksi: request.detail.id_konstruksi,
            id_header: header.id,
            nama_pekerjaan: request.detail.nama_pekerjaan,
            penyulang: request.detail.penyulang,
            panjang_jaringan: request.detail.panjang_jaringan,
            long: request.detail.long,
            lat: request.detail.lat,
            foto: request.detail.foto,
            keterangan: request.detail.keterangan,
            petugas_survey: request.detail.petugas_survey,
          },
          prisma,
        );

        return { header, detail };
      });

      const result = {
        header: header,
        detail: detail,
      };

      return result;
    } catch (error) {
      throw error;
    }
  },
};
