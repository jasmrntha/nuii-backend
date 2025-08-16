import { SurveyStatus } from '@prisma/client';

import prisma from '../config/prisma';
import { type UploadExcelRequest } from '../models';
import { ExcelArchive, SurveyHeader } from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ExcelService = {
  async uploadExcel(request: UploadExcelRequest) {
    try {
      const { header, archive } = await prisma.$transaction(async prisma => {
        const header = await SurveyHeader.createHeader(
          {
            nama_survey: request.header.nama_survey,
            nama_pekerjaan: request.header.nama_pekerjaan,
            lokasi: request.header.lokasi,
            user_id: request.header.user_id,
            status_survey: SurveyStatus.Disetujui,
          },
          prisma,
        );

        const archive = await ExcelArchive.createData(
          {
            file_name: request.file.file_name,
            file_path: request.file.file_path,
            survey_header_id: header.id,
          },
          prisma,
        );

        return { header, archive };
      });

      const result = {
        header,
        archive,
      };

      return result;
    } catch (error) {
      throw error;
    }
  },
};
