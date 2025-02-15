import { StatusCodes } from 'http-status-codes';

import prisma from '../config/prisma';
import { CustomError } from '../middleware';
import {
  type CreateNewSurveyRequest,
  type CreateSurveyRequest,
  type UpdateSurveyHeaderRequest,
  type UpdateSurveyDetailRequest,
} from '../models';
import {
  SurveyHeader,
  SurveyDetail,
  Material,
  Konstruksi,
  KonstruksiMaterial,
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
  async updateSurveyHeader(request: UpdateSurveyHeaderRequest) {
    try {
      const header = await SurveyHeader.findHeaderById(request.id_header);

      if (!header) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Header Not Found');
      }

      const { result } = await prisma.$transaction(async prisma => {
        const result = await SurveyHeader.updateHeader(
          request.id_header,
          {
            nama_survey: request.header.nama_survey,
            lokasi: request.header.lokasi,
            user_id: request.header.user_id,
            status_survey: request.header.status_survey,
          },
          prisma,
        );

        return { result };
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
  async updateSurveyDetail(request: UpdateSurveyDetailRequest) {
    try {
      const detail = await SurveyDetail.findDetailById(request.id_detail);

      if (!detail) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Detail Not Found');
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

      const { result } = await prisma.$transaction(async prisma => {
        const result = await SurveyDetail.updateDetail(
          request.id_detail,
          {
            id_material_tiang: request.detail.id_material_tiang,
            id_material_konduktor: request.detail.id_material_konduktor,
            id_konstruksi: request.detail.id_konstruksi,
            id_header: request.detail.id_header,
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

        return { result };
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
  async exportSurvey(id: string) {
    try {
      // Step 1: Get the survey header and its details
      const survey = await SurveyHeader.findSurveyById(id);

      if (!survey) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      const details = survey.survey_details;

      // Step 2: Count the amount of each unique id_konstruksi and id_material_tiang
      const konstruksiCount: Record<string, number> = {};
      const tiangCount: Record<string, number> = {};

      for (const detail of details) {
        if (!konstruksiCount[detail.id_konstruksi]) {
          konstruksiCount[detail.id_konstruksi] = 0;
        }

        konstruksiCount[detail.id_konstruksi]++;

        if (!tiangCount[detail.id_material_tiang]) {
          tiangCount[detail.id_material_tiang] = 0;
        }

        tiangCount[detail.id_material_tiang]++;
      }

      // Step 3: Get all materials required and the amount for each unique konstruksi and tiang
      const konstruksiMaterials = await Promise.all(
        Object.keys(konstruksiCount).map(async id_konstruksi => {
          const materials =
            await KonstruksiMaterial.findMaterialForKonstruksiById(
              id_konstruksi,
            );

          return { id_konstruksi, materials };
        }),
      );

      const tiangMaterials = await Promise.all(
        Object.keys(tiangCount).map(async id_material_tiang => {
          const materials = await Material.findMaterialById(id_material_tiang);

          return { id_material_tiang, materials };
        }),
      );

      // Step 4: Calculate the total price of each material for each unique konstruksi
      const totalPrices = await Promise.all(
        konstruksiMaterials.map(async ({ id_konstruksi, materials }) => {
          const materialPrices = await Promise.all(
            materials.map(async material => {
              const materialData = await Material.findMaterialById(
                material.id_material,
              );
              const totalHargaMaterial =
                materialData.harga_material *
                material.kuantitas *
                konstruksiCount[id_konstruksi];

              const totalPasang =
                materialData.pasang_rab *
                material.kuantitas *
                konstruksiCount[id_konstruksi];

              const totalBongkar =
                materialData.bongkar *
                material.kuantitas *
                konstruksiCount[id_konstruksi];

              return {
                ...materialData,
                kategori_material: material.kategori_material,
                kuantitas: material.kuantitas,
                total_harga_material: totalHargaMaterial,
                total_pasang: totalPasang,
                total_bongkar: totalBongkar,
              };
            }),
          );

          return {
            id_konstruksi,
            materials: materialPrices,
          };
        }),
      );

      // Step 5: Calculate the total price of each tiang material
      const tiangPrices = await Promise.all(
        tiangMaterials.map(({ id_material_tiang, materials }) => {
          const materialData = materials;
          const totalHargaMaterial =
            materialData.harga_material * tiangCount[id_material_tiang];

          const totalPasang =
            materialData.pasang_rab * tiangCount[id_material_tiang];

          const totalBongkar =
            materialData.bongkar * tiangCount[id_material_tiang];

          return {
            ...materialData,
            kuantitas: tiangCount[id_material_tiang],
            total_harga_material: totalHargaMaterial,
            total_pasang: totalPasang,
            total_bongkar: totalBongkar,
          };
        }),
      );

      return {
        data_survey: survey,
        detail_tiang: tiangPrices,
        detail_konstruksi: totalPrices,
      };
    } catch (error) {
      throw error;
    }
  },
};
