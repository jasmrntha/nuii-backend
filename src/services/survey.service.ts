// eslint-disable-next-line import/no-extraneous-dependencies
import ExcelJS from 'exceljs';
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
  TipePekerjaan,
  PoleRepository,
  GroundingRepository,
  PoleMaterialRepository,
  GroundingMaterialRepository,
} from '../repositories';

function formatWorksheetRow(worksheet: ExcelJS.Worksheet, rowIndex: number) {
  const row = worksheet.getRow(rowIndex);

  // Ensure the row has at least one value to be recognized
  for (let col = 2; col <= 17; col++) {
    // Skipping column 1 (A)
    if (!row.getCell(col).value) {
      row.getCell(col).value = '-';
    } // Set a placeholder value
  }

  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber > 1 && colNumber < 18) {
      // Skip column A
      cell.border = {
        top: { style: 'dotted' },
        left: { style: 'thin' },
        bottom: { style: 'dotted' },
        right: { style: 'thin' },
      };

      if (cell.value == '-') {
        cell.value = '';
      }
    }
  });
}

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
        header.id_material_konduktor,
      );

      if (!tiang || !konduktor) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { detail } = await prisma.$transaction(async prisma => {
        const detail = await SurveyDetail.createDetail(
          {
            id_material_tiang: request.detail.id_material_tiang,
            id_konstruksi: request.detail.id_konstruksi,
            id_header: request.id_header,
            id_pole_supporter: request.detail.id_pole,
            id_grounding_termination: request.detail.id_grounding,
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

      // const konduktor = await Material.findMaterialById(
      //   request.detail.id_material_konduktor,
      // );

      if (!tiang) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { header, detail } = await prisma.$transaction(async prisma => {
        const header = await SurveyHeader.createHeader(
          {
            nama_survey: request.header.nama_survey,
            nama_pekerjaan: request.header.nama_pekerjaan,
            lokasi: request.header.lokasi,
            user_id: request.header.user_id,
            status_survey: request.header.status_survey,
            id_material_konduktor: request.header.id_material_konduktor,
          },
          prisma,
        );

        const detail = await SurveyDetail.createDetail(
          {
            id_material_tiang: request.detail.id_material_tiang,
            id_konstruksi: request.detail.id_konstruksi,
            id_header: header.id,
            id_pole_supporter: request.detail.id_pole,
            id_grounding_termination: request.detail.id_grounding,
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

      // const konduktor = await Material.findMaterialById(
      //   request.detail.id_material_konduktor,
      // );

      if (!tiang) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { result } = await prisma.$transaction(async prisma => {
        const result = await SurveyDetail.updateDetail(
          request.id_detail,
          {
            id_material_tiang: request.detail.id_material_tiang,
            id_konstruksi: request.detail.id_konstruksi,
            id_header: request.detail.id_header,
            id_pole_supporter: request.detail.id_pole,
            id_grounding_termination: request.detail.id_grounding,
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
  async exportSurvey(id: number) {
    try {
      // Step 1: Get the survey header and its details
      const survey = await SurveyHeader.findSurveyById(id);

      if (!survey) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      const details = survey.survey_details;

      // Step 2: Count the amount of each unique id_konstruksi and id_material_tiang
      const konstruksiCount: Record<number, number> = {};
      const tiangCount: Record<number, number> = {};
      const konduktorCount: Record<number, number> = {};

      for (const detail of details) {
        if (!konstruksiCount[detail.id_konstruksi]) {
          konstruksiCount[detail.id_konstruksi] = 0;
        }

        konstruksiCount[detail.id_konstruksi]++;

        if (!tiangCount[detail.id_material_tiang]) {
          tiangCount[detail.id_material_tiang] = 0;
        }

        tiangCount[detail.id_material_tiang]++;

        konduktorCount[survey.id_material_konduktor] += detail.panjang_jaringan;
      }

      // Step 3: Get all materials required and the amount for each unique konstruksi and tiang
      const konstruksiMaterials = await Promise.all(
        Object.keys(konstruksiCount).map(async key => {
          const idKonstruksi = Number(key);
          const materials =
            await KonstruksiMaterial.findMaterialForKonstruksiById(
              idKonstruksi,
            );

          return { idKonstruksi, materials };
        }),
      );

      const tiangMaterials = await Promise.all(
        Object.keys(tiangCount).map(async key => {
          const idMaterialTiang = Number(key);
          const materials = await Material.findMaterialById(idMaterialTiang);

          return { idMaterialTiang, materials };
        }),
      );

      const konduktorMaterials = await Promise.all(
        Object.keys(konduktorCount).map(async key => {
          const idKonduktor = Number(key);
          const materials = await Material.findMaterialById(idKonduktor);

          return { idKonduktor, materials };
        }),
      );

      // Step 4: Calculate the total price of each material for each unique konstruksi
      const totalPrices = await Promise.all(
        konstruksiMaterials.map(async ({ idKonstruksi, materials }) => {
          const materialPrices = await Promise.all(
            materials.map(async material => {
              const materialData = await Material.findMaterialById(
                material.id_material,
              );
              const tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
                material.id_tipe_pekerjaan,
              );
              const totalHargaMaterial =
                materialData.harga_material *
                Number(material.kuantitas) *
                konstruksiCount[idKonstruksi];

              const totalPasang =
                materialData.pasang_rab *
                Number(material.kuantitas) *
                konstruksiCount[idKonstruksi];

              const totalBongkar =
                materialData.bongkar * konstruksiCount[idKonstruksi];

              return {
                data_material: { ...materialData },
                tipe_pekerjaan: tipePekerjaan.tipe_pekerjaan,
                kuantitas: material.kuantitas,
                total_kuantitas:
                  Number(material.kuantitas) * konstruksiCount[idKonstruksi],
                total_harga_material: totalHargaMaterial,
                total_pasang: totalPasang,
                total_bongkar: totalBongkar,
              };
            }),
          );

          return {
            idKonstruksi,
            materials: materialPrices,
          };
        }),
      );

      // Step 5: Calculate the total price of each tiang material
      const tiangPrices = await Promise.all(
        tiangMaterials.map(({ idMaterialTiang, materials }) => {
          const materialData = materials;
          const totalHargaMaterial =
            materialData.harga_material * tiangCount[idMaterialTiang];

          const totalPasang =
            materialData.pasang_rab * tiangCount[idMaterialTiang];

          const totalBongkar =
            materialData.bongkar * tiangCount[idMaterialTiang];

          return {
            data_tiang: { ...materialData },
            total_kuantitas: tiangCount[idMaterialTiang],
            total_harga_material: totalHargaMaterial,
            total_pasang: totalPasang,
            total_bongkar: totalBongkar,
          };
        }),
      );

      const konduktorPrices = await Promise.all(
        konduktorMaterials.map(({ idKonduktor, materials }) => {
          const materialData = materials;
          const totalHargaMaterial =
            materialData.harga_material * konduktorCount[idKonduktor];

          const totalPasang =
            materialData.pasang_rab * konduktorCount[idKonduktor];

          const totalBongkar =
            materialData.bongkar * konduktorCount[idKonduktor];

          return {
            data_konduktor: { ...materialData },
            total_kuantitas: konduktorCount[idKonduktor],
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
        detail_konduktor: konduktorPrices,
      };
    } catch (error) {
      throw error;
    }
  },
  async deleteSurveyDetail(id: number) {
    try {
      const detail = await SurveyDetail.findDetailById(id);

      if (!detail) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Detail Not Found');
      }

      const header = await SurveyHeader.findHeaderById(detail.id_header);

      if (!header) {
        throw new CustomError(
          StatusCodes.METHOD_NOT_ALLOWED,
          'Survey Header for this Detail is already accepted. Unable to Delete.',
        );
      }

      const deleteSurvey = await SurveyDetail.deleteDetail(id);

      return deleteSurvey;
    } catch (error) {
      throw error;
    }
  },
  async deleteSurvey(id: number) {
    try {
      const survey = await SurveyHeader.findHeaderById(id);

      if (!survey) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      const getDetails = await SurveyDetail.detailByHeaderId(id);

      if (getDetails.length > 0) {
        for (const detail of getDetails) {
          await SurveyDetail.deleteDetail(detail.id);
        }
      }

      const deleteSurvey = await SurveyHeader.deleteSurvey(id);

      return deleteSurvey;
    } catch (error) {
      throw error;
    }
  },
  async getSurveyNameList() {
    try {
      const getNames = await SurveyHeader.getSurveyNameList();

      if (getNames.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      return getNames;
    } catch (error) {
      throw error;
    }
  },
  async getAllSurveyHeader() {
    try {
      const getHeader = await SurveyHeader.getHeaderOnly();

      if (getHeader.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      return getHeader;
    } catch (error) {
      throw error;
    }
  },
  async getSurveyDetail(id: number) {
    try {
      const getHeader = await SurveyHeader.getSurveyHeader(id);

      if (!getHeader) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      const getDetail = await SurveyDetail.detailByHeaderId(id);

      if (getDetail.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Detail Not Found');
      }

      return {
        header: getHeader,
        detail: getDetail,
      };
    } catch (error) {
      throw error;
    }
  },
  async getAllReport() {
    try {
      const getReport = await SurveyHeader.getAllReport();

      if (getReport.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Report Not Found');
      }

      return getReport;
    } catch (error) {
      throw error;
    }
  },
  async getReportDetail(id: number) {
    try {
      const getHeader = await SurveyHeader.getReportById(id);

      if (!getHeader) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Report Not Found');
      }

      const getDetail = await SurveyDetail.detailByHeaderId(id);

      if (getDetail.length === 0) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Report Detail Not Found');
      }

      return {
        header: getHeader,
        detail: getDetail,
      };
    } catch (error) {
      throw error;
    }
  },
  async exportSurveyToExcel(id: number) {
    try {
      // Step 1: Get the survey header and its details
      const survey = await SurveyHeader.findSurveyById(id);

      if (!survey) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      const details = survey.survey_details;

      let totalAkhirBerat = 0;

      // Step 2: Count the amount of each unique id_konstruksi and id_material_tiang
      const konstruksiCount: Record<number, number> = {};
      const tiangCount: Record<number, number> = {};
      const konduktorCount: Record<number, number> = {};
      const poleCount: Record<number, number> = {};
      const groundingCount: Record<number, Record<number, number>> = {}; // Fix: Use a nested object

      for (const detail of details) {
        if (!konstruksiCount[detail.id_konstruksi]) {
          konstruksiCount[detail.id_konstruksi] = 0;
        }

        konstruksiCount[detail.id_konstruksi]++;

        if (!tiangCount[detail.id_material_tiang]) {
          tiangCount[detail.id_material_tiang] = 0;
        }

        tiangCount[detail.id_material_tiang]++;

        if (!konduktorCount[survey.id_material_konduktor]) {
          konduktorCount[survey.id_material_konduktor] = 0;
        }

        konduktorCount[survey.id_material_konduktor] += detail.panjang_jaringan;

        if (detail.id_pole_supporter) {
          if (!poleCount[detail.id_pole_supporter]) {
            poleCount[detail.id_pole_supporter] = 0;
          }

          poleCount[detail.id_pole_supporter]++;
        }

        if (detail.id_grounding_termination) {
          if (!groundingCount[detail.id_grounding_termination]) {
            groundingCount[detail.id_grounding_termination] = {}; // Fix: Ensure it's an object
          }

          if (
            !groundingCount[detail.id_grounding_termination][
              detail.id_konstruksi
            ]
          ) {
            groundingCount[detail.id_grounding_termination][
              detail.id_konstruksi
            ] = 0;
          }

          groundingCount[detail.id_grounding_termination][
            detail.id_konstruksi
          ]++;
        }
      }

      // Step 3: Get all materials required and the amount for each unique konstruksi and tiang
      const konstruksiMaterials = await Promise.all(
        Object.keys(konstruksiCount).map(async key => {
          const idKonstruksi = Number(key);
          const materials =
            await KonstruksiMaterial.findMaterialForKonstruksiById(
              idKonstruksi,
            );

          return { idKonstruksi, materials };
        }),
      );

      const tiangMaterials = await Promise.all(
        Object.keys(tiangCount).map(async key => {
          const idMaterialTiang = Number(key);
          const materials = await Material.findMaterialById(idMaterialTiang);

          return { idMaterialTiang, materials };
        }),
      );

      const konduktorMaterials = await Promise.all(
        Object.keys(konduktorCount).map(async key => {
          const idKonduktor = Number(key);
          const materials = await Material.findMaterialById(idKonduktor);

          return { idKonduktor, materials };
        }),
      );

      const poleMaterials = await Promise.all(
        Object.keys(poleCount).map(async key => {
          const idPole = Number(key);
          const materials =
            await PoleMaterialRepository.getPoleMaterialsByPoleId(idPole);

          return { idPole, materials };
        }),
      );

      const groundingMaterials = await Promise.all(
        Object.keys(groundingCount).map(async key => {
          const idGrounding = Number(key);
          const materials =
            await GroundingMaterialRepository.getGroundingMaterialsByGroundingId(
              idGrounding,
            );

          const idKonstruksi = Object.keys(groundingCount[idGrounding]).map(
            Number,
          );

          return { idGrounding, idKonstruksi, materials };
        }),
      );

      // Step 4: Calculate the total price of each material for each unique konstruksi
      const totalPrices = await Promise.all(
        konstruksiMaterials.map(async ({ idKonstruksi, materials }) => {
          const materialPrices = await Promise.all(
            materials.map(async material => {
              const materialData = await Material.findMaterialById(
                material.id_material,
              );
              const tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
                material.id_tipe_pekerjaan,
              );
              const totalHargaMaterial =
                materialData.harga_material *
                Number(material.kuantitas) *
                konstruksiCount[idKonstruksi];

              const totalPasang =
                materialData.pasang_rab *
                Number(material.kuantitas) *
                konstruksiCount[idKonstruksi];

              const totalBongkar =
                materialData.bongkar * konstruksiCount[idKonstruksi];

              const totalBerat =
                (Number(materialData.berat_material) *
                  Number(material.kuantitas) *
                  konstruksiCount[idKonstruksi]) /
                1000;

              return {
                data_material: { ...materialData },
                tipe_pekerjaan: tipePekerjaan.tipe_pekerjaan,
                kuantitas: material.kuantitas,
                total_kuantitas:
                  Number(material.kuantitas) * konstruksiCount[idKonstruksi],
                total_berat: totalBerat,
                total_harga_material: totalHargaMaterial,
                total_pasang: totalPasang,
                total_bongkar: totalBongkar,
              };
            }),
          );

          return {
            idKonstruksi,
            materials: materialPrices,
          };
        }),
      );

      // Step 5: Calculate the total price of each tiang material
      const tiangPrices = await Promise.all(
        tiangMaterials.map(({ idMaterialTiang, materials }) => {
          const materialData = materials;
          const totalHargaMaterial =
            materialData.harga_material * tiangCount[idMaterialTiang];

          const totalPasang =
            materialData.pasang_rab * tiangCount[idMaterialTiang];

          const totalBongkar =
            materialData.bongkar * tiangCount[idMaterialTiang];

          const totalBerat =
            (Number(materialData.berat_material) *
              tiangCount[idMaterialTiang]) /
            1000;

          return {
            data_tiang: { ...materialData },
            total_kuantitas: tiangCount[idMaterialTiang],
            total_berat: totalBerat,
            total_harga_material: totalHargaMaterial,
            total_pasang: totalPasang,
            total_bongkar: totalBongkar,
          };
        }),
      );

      const konduktorPrices = await Promise.all(
        konduktorMaterials.map(({ idKonduktor, materials }) => {
          const materialData = materials;

          let multiplier = materials.nomor_material === 5 ? 3.045 : 3.06;

          if (materials.nomor_material === 77) {
            multiplier = 1;
          }

          const totalConductor = (konduktorCount[idKonduktor] * multiplier) / 1;

          const totalHargaMaterial =
            materialData.harga_material * totalConductor;

          const totalPasang = materialData.pasang_rab * totalConductor;

          const totalBongkar = materialData.bongkar * totalConductor;

          const totalBerat =
            (Number(materialData.berat_material) * totalConductor) / 1000;

          return {
            data_konduktor: { ...materialData },
            total_kuantitas: totalConductor,
            total_berat: totalBerat,
            total_harga_material: totalHargaMaterial,
            total_pasang: totalPasang,
            total_bongkar: totalBongkar,
          };
        }),
      );

      const polePrices = await Promise.all(
        poleMaterials.map(async ({ idPole, materials }) => {
          const materialPrices = await Promise.all(
            materials.map(async material => {
              const materialData = await Material.findMaterialById(
                material.id_material,
              );

              let tipePekerjaan = null;

              if (material.id_tipe_pekerjaan) {
                tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
                  material.id_tipe_pekerjaan,
                );
              }

              const totalHargaMaterial =
                materialData.harga_material *
                Number(material.kuantitas) *
                poleCount[idPole];

              const totalPasang =
                materialData.pasang_rab *
                Number(material.kuantitas) *
                poleCount[idPole];

              const totalBongkar = materialData.bongkar * poleCount[idPole];

              const totalBerat =
                (Number(materialData.berat_material) *
                  Number(material.kuantitas) *
                  poleCount[idPole]) /
                1000;

              return {
                data_material: { ...materialData },
                tipe_pekerjaan: tipePekerjaan
                  ? tipePekerjaan.tipe_pekerjaan
                  : '',
                kuantitas: material.kuantitas,
                total_kuantitas: Number(material.kuantitas) * poleCount[idPole],
                total_berat: totalBerat,
                total_harga_material: totalHargaMaterial,
                total_pasang: totalPasang,
                total_bongkar: totalBongkar,
              };
            }),
          );

          return {
            idPole,
            materials: materialPrices,
          };
        }),
      );

      const groundingPrices = await Promise.all(
        groundingMaterials.map(
          async ({ idGrounding, idKonstruksi, materials }) => {
            // Sum all counts for the given `idGrounding`
            const totalGroundingCount = groundingCount[idGrounding]
              ? Object.values(groundingCount[idGrounding]).reduce(
                  (accumulator, count) => accumulator + count,
                  0,
                )
              : 0;

            const materialPrices = await Promise.all(
              materials.map(async material => {
                const materialData = await Material.findMaterialById(
                  material.id_material,
                );
                const tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
                  material.id_tipe_pekerjaan,
                );

                const totalKuantitas =
                  Number(material.kuantitas) * totalGroundingCount;
                const totalHargaMaterial =
                  materialData.harga_material * totalKuantitas;
                const totalPasang = materialData.pasang_rab * totalKuantitas;
                const totalBongkar = materialData.bongkar * totalGroundingCount;
                const totalBerat =
                  (Number(materialData.berat_material) * totalKuantitas) / 1000;

                return {
                  data_material: { ...materialData },
                  tipe_pekerjaan: tipePekerjaan.tipe_pekerjaan,
                  kuantitas: material.kuantitas,
                  total_kuantitas: totalKuantitas,
                  total_berat: totalBerat,
                  total_harga_material: totalHargaMaterial,
                  total_pasang: totalPasang,
                  total_bongkar: totalBongkar,
                };
              }),
            );

            return idKonstruksi.map(konstruksiId => ({
              idGrounding,
              idKonstruksi: konstruksiId, // Now explicitly associating each grounding with a konstruksi
              materials: materialPrices,
            }));
          },
        ),
      );

      // Flatten the nested array to get a single-level list of grounding prices
      const flattenedGroundingPrices = groundingPrices.flat();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      // Set column widths
      worksheet.columns = [
        { width: 5 },
        { width: 10 },
        { width: 90 },
        { width: 15 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 10 },
        { width: 10 },
        { width: 10 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 17 },
      ];

      // Merging cells for PLN Header
      worksheet.mergeCells('C2:D2');
      worksheet.getCell('C2').value = 'PT PLN (PERSERO)';

      worksheet.mergeCells('C3:D3');
      worksheet.getCell('C3').value = 'DISTRIBUSI JAWA TIMUR';

      worksheet.mergeCells('C4:D4');
      worksheet.getCell('C4').value = 'UP3 SURABAYA BARAT';

      // Merge for Title
      worksheet.mergeCells('B6:Q6');
      worksheet.getCell('B6').value = 'RENCANA ANGGARAN BIAYA ESTETIKA';
      worksheet.getCell('B6').alignment = { horizontal: 'center' };

      // Merging cells and filling job description details
      worksheet.mergeCells('E8:G8');
      worksheet.getCell('E8').value = 'URAIAN PEKERJAAN';
      worksheet.getCell('H8').value = ':';
      worksheet.getCell('H8').alignment = { horizontal: 'center' };
      worksheet.getCell('I8').value =
        'PASANG BARU KOL ESTETIKA PR. ROYAL MENGANTI RESIDENCE 21 UNIT 2200 VA & 54 UNIT 3500 VA';

      worksheet.mergeCells('E9:G9');
      worksheet.getCell('E9').value = 'JENIS';
      worksheet.getCell('H9').value = ':';
      worksheet.getCell('H9').alignment = { horizontal: 'center' };
      worksheet.getCell('I9').value = 'PEMASANGAN SUTM';

      worksheet.mergeCells('E10:G10');
      worksheet.getCell('E10').value = 'LOKASI';
      worksheet.getCell('H10').value = ':';
      worksheet.getCell('H10').alignment = { horizontal: 'center' };
      worksheet.getCell('I10').value = 'PR. ROYAL MENGANTI RESIDENCE';

      worksheet.getCell('H11').value = ':';
      worksheet.getCell('H11').alignment = { horizontal: 'center' };
      worksheet.getCell('I11').value = 'MENGANTI';

      worksheet.mergeCells('E12:G12');
      worksheet.getCell('E12').value = 'VOLUME';
      worksheet.getCell('H12').value = ':';
      worksheet.getCell('H12').alignment = { horizontal: 'center' };
      worksheet.getCell('I12').value = '135';
      worksheet.getCell('I12').alignment = { horizontal: 'center' };
      worksheet.getCell('J12').value = 'MS';
      worksheet.getCell('J12').alignment = { horizontal: 'center' };

      // Table Headers
      const headers = [
        '',
        'NO. MAT',
        'PEKERJAAN',
        'JENIS MDU',
        'Berat',
        'Sat',
        'Berat Total',
        'Volume',
        '',
        '',
        'Harga Satuan',
        '',
        '',
        'Jumlah Harga',
        '',
        '',
        'JUMLAH',
      ];

      worksheet.getRow(15).values = headers;
      worksheet.getRow(16).values = [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Material',
        'Pasang',
        'Bongkar',
        'Material',
        'Pasang',
        'Bongkar',
        'Material',
        'Pasang',
        'Bongkar',
        '',
      ];

      worksheet.mergeCells('B15:B16');
      worksheet.mergeCells('C15:C16');
      worksheet.mergeCells('D15:D16');
      worksheet.mergeCells('E15:E16');
      worksheet.mergeCells('F15:F16');
      worksheet.mergeCells('G15:G16');
      worksheet.mergeCells('H15:J15');
      worksheet.mergeCells('K15:M15');
      worksheet.mergeCells('N15:P15');
      worksheet.mergeCells('Q15:Q16');

      worksheet.getRow(15).height = 30;
      worksheet.getRow(16).height = 40;

      // Formatting header row
      for (const rowNumber of [15, 16]) {
        const row = worksheet.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber > 1 && colNumber < 18) {
            // Skip column A
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          }
        });
      }

      formatWorksheetRow(worksheet, 17);

      let previousRow = 17;

      previousRow += 1;
      worksheet.getCell(`C${previousRow}`).value = '   TIANG BETON';

      formatWorksheetRow(worksheet, previousRow);

      let totalTiang = 0;

      for (const tiang of tiangPrices) {
        previousRow += 1;
        worksheet.getCell(`B${previousRow}`).value =
          tiang.data_tiang.nomor_material;
        worksheet.getCell(`C${previousRow}`).value =
          tiang.data_tiang.nama_material;
        worksheet.getCell(`D${previousRow}`).value =
          tiang.data_tiang.jenis_material;
        worksheet.getCell(`D${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`E${previousRow}`).value = Number(
          tiang.data_tiang.berat_material,
        );
        worksheet.getCell(`E${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`F${previousRow}`).value =
          tiang.data_tiang.satuan_material;
        worksheet.getCell(`F${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`G${previousRow}`).value = tiang.total_berat;

        totalAkhirBerat += tiang.total_berat;

        worksheet.getCell(`G${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`H${previousRow}`).value = tiang.total_kuantitas;
        worksheet.getCell(`H${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`I${previousRow}`).value = tiang.total_kuantitas;
        totalTiang += tiang.total_kuantitas;
        worksheet.getCell(`I${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`J${previousRow}`).value = {
          formula: '0',
          result: 0,
        };
        worksheet.getCell(`J${previousRow}`).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
        worksheet.getCell(`K${previousRow}`).value =
          tiang.data_tiang.harga_material;
        worksheet.getCell(`L${previousRow}`).value =
          tiang.data_tiang.pasang_rab;
        worksheet.getCell(`N${previousRow}`).value = tiang.total_harga_material;
        worksheet.getCell(`O${previousRow}`).value = tiang.total_pasang;
        worksheet.getCell(`Q${previousRow}`).value =
          tiang.total_harga_material + tiang.total_pasang;

        formatWorksheetRow(worksheet, previousRow);
      }

      previousRow += 1;
      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      worksheet.getCell(`C${previousRow}`).value = '   POLE SUPPORTER :';

      formatWorksheetRow(worksheet, previousRow);

      for (const poles of polePrices) {
        const pole = await PoleRepository.getPoleById(poles.idPole);
        previousRow += 1;
        worksheet.getCell(`C${previousRow}`).value =
          `   ${pole.nama_pole.toUpperCase()}`;
        formatWorksheetRow(worksheet, previousRow);

        const groupedMaterials: Record<string, typeof poles.materials> = {};

        for (const item of poles.materials) {
          if (!groupedMaterials[item.tipe_pekerjaan]) {
            groupedMaterials[item.tipe_pekerjaan] = [];
          }

          groupedMaterials[item.tipe_pekerjaan].push(item);
        }

        for (const [groupKey, group] of Object.entries(groupedMaterials)) {
          if (groupKey != '') {
            previousRow += 1;
            worksheet.getCell(`C${previousRow}`).value = `   ${groupKey} :`;
            formatWorksheetRow(worksheet, previousRow);
          }

          // Process each material in the group
          for (const calculatedPole of group) {
            previousRow += 1;

            totalAkhirBerat += calculatedPole.total_berat;

            const rowData = [
              { col: 'B', value: calculatedPole.data_material.nomor_material },
              { col: 'C', value: calculatedPole.data_material.nama_material },
              {
                col: 'D',
                value: calculatedPole.data_material.jenis_material,
                isAlign: true,
              },
              {
                col: 'E',
                value: Number(calculatedPole.data_material.berat_material),
                isAlign: true,
              },
              {
                col: 'F',
                value: calculatedPole.data_material.satuan_material,
                isAlign: true,
              },
              { col: 'G', value: calculatedPole.total_berat, isAlign: true },
              {
                col: 'H',
                value: calculatedPole.total_kuantitas,
                isAlign: true,
              },
              {
                col: 'I',
                value: calculatedPole.total_kuantitas,
                isAlign: true,
              },
              { col: 'J', value: { formula: '0', result: 0 }, isAlign: true },
              { col: 'K', value: calculatedPole.data_material.harga_material },
              { col: 'L', value: calculatedPole.data_material.pasang_rab },
              { col: 'N', value: calculatedPole.total_harga_material },
              { col: 'O', value: calculatedPole.total_pasang },
              {
                col: 'Q',
                value:
                  calculatedPole.total_harga_material +
                  calculatedPole.total_pasang,
              },
            ];

            // Apply values and alignments
            for (const { col, value, isAlign } of rowData) {
              worksheet.getCell(`${col}${previousRow}`).value = value;

              if (isAlign) {
                worksheet.getCell(`${col}${previousRow}`).alignment = {
                  horizontal: 'center',
                  vertical: 'middle',
                };
              }
            }

            formatWorksheetRow(worksheet, previousRow);
          }
        }

        previousRow += 1;
        formatWorksheetRow(worksheet, previousRow);
      }

      previousRow += 1;
      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      worksheet.getCell(`C${previousRow}`).value = '   POLE TOP ARRANGEMENT :';
      formatWorksheetRow(worksheet, previousRow);

      for (const calculatedKonstruksi of totalPrices) {
        const konstruksi = await Konstruksi.findKonstruksiById(
          calculatedKonstruksi.idKonstruksi,
        );

        // Find the corresponding groundingPrices entry
        const groundingPricesForKonstruksi = flattenedGroundingPrices.filter(
          g => g.idKonstruksi === calculatedKonstruksi.idKonstruksi,
        );

        previousRow += 1;
        worksheet.getCell(`C${previousRow}`).value =
          `   ${konstruksi.nama_konstruksi.toUpperCase()}`;
        formatWorksheetRow(worksheet, previousRow);

        const groupedMaterials: Record<
          string,
          typeof calculatedKonstruksi.materials
        > = {};

        for (const item of calculatedKonstruksi.materials) {
          if (!groupedMaterials[item.tipe_pekerjaan]) {
            groupedMaterials[item.tipe_pekerjaan] = [];
          }

          groupedMaterials[item.tipe_pekerjaan].push(item);
        }

        for (const [groupKey, group] of Object.entries(groupedMaterials)) {
          if (groupKey != '') {
            previousRow += 1;
            worksheet.getCell(`C${previousRow}`).value = `   ${groupKey} :`;
            formatWorksheetRow(worksheet, previousRow);
          }

          // Process each material in the group
          for (const calculatedPole of group) {
            previousRow += 1;

            totalAkhirBerat += calculatedPole.total_berat;

            const rowData = [
              { col: 'B', value: calculatedPole.data_material.nomor_material },
              { col: 'C', value: calculatedPole.data_material.nama_material },
              {
                col: 'D',
                value: calculatedPole.data_material.jenis_material,
                isAlign: true,
              },
              {
                col: 'E',
                value: Number(calculatedPole.data_material.berat_material),
                isAlign: true,
              },
              {
                col: 'F',
                value: calculatedPole.data_material.satuan_material,
                isAlign: true,
              },
              { col: 'G', value: calculatedPole.total_berat, isAlign: true },
              {
                col: 'H',
                value: calculatedPole.total_kuantitas,
                isAlign: true,
              },
              {
                col: 'I',
                value: calculatedPole.total_kuantitas,
                isAlign: true,
              },
              { col: 'J', value: { formula: '0', result: 0 }, isAlign: true },
              { col: 'K', value: calculatedPole.data_material.harga_material },
              { col: 'L', value: calculatedPole.data_material.pasang_rab },
              { col: 'N', value: calculatedPole.total_harga_material },
              { col: 'O', value: calculatedPole.total_pasang },
              {
                col: 'Q',
                value:
                  calculatedPole.total_harga_material +
                  calculatedPole.total_pasang,
              },
            ];

            // Apply values and alignments
            for (const { col, value, isAlign } of rowData) {
              worksheet.getCell(`${col}${previousRow}`).value = value;

              if (isAlign) {
                worksheet.getCell(`${col}${previousRow}`).alignment = {
                  horizontal: 'center',
                  vertical: 'middle',
                };
              }
            }

            formatWorksheetRow(worksheet, previousRow);
          }
        }

        previousRow += 1;
        formatWorksheetRow(worksheet, previousRow);

        // Example usage of groundingPrice
        if (
          groundingPricesForKonstruksi &&
          groundingPricesForKonstruksi.length > 0
        ) {
          // You can use groundingPrice here however you need
          for (const groundingPrice of groundingPricesForKonstruksi) {
            const grounding = await GroundingRepository.getGroundingById(
              groundingPrice.idGrounding,
            );

            previousRow += 1;
            worksheet.getCell(`C${previousRow}`).value =
              `   ${grounding.nama_grounding.toUpperCase()}`;
            formatWorksheetRow(worksheet, previousRow);

            const groupedMaterials: Record<
              string,
              typeof groundingPrice.materials
            > = {};

            for (const item of groundingPrice.materials) {
              if (!groupedMaterials[item.tipe_pekerjaan]) {
                groupedMaterials[item.tipe_pekerjaan] = [];
              }

              groupedMaterials[item.tipe_pekerjaan].push(item);
            }

            for (const [groupKey, group] of Object.entries(groupedMaterials)) {
              if (groupKey != '') {
                previousRow += 1;
                worksheet.getCell(`C${previousRow}`).value = `   ${groupKey} :`;
                formatWorksheetRow(worksheet, previousRow);
              }

              // Process each material in the group
              for (const calculatedGrounding of group) {
                previousRow += 1;

                totalAkhirBerat += calculatedGrounding.total_berat;

                const rowData = [
                  {
                    col: 'B',
                    value: calculatedGrounding.data_material.nomor_material,
                  },
                  {
                    col: 'C',
                    value: calculatedGrounding.data_material.nama_material,
                  },
                  {
                    col: 'D',
                    value: calculatedGrounding.data_material.jenis_material,
                    isAlign: true,
                  },
                  {
                    col: 'E',
                    value: Number(
                      calculatedGrounding.data_material.berat_material,
                    ),
                    isAlign: true,
                  },
                  {
                    col: 'F',
                    value: calculatedGrounding.data_material.satuan_material,
                    isAlign: true,
                  },
                  {
                    col: 'G',
                    value: calculatedGrounding.total_berat,
                    isAlign: true,
                  },
                  {
                    col: 'H',
                    value: calculatedGrounding.total_kuantitas,
                    isAlign: true,
                  },
                  {
                    col: 'I',
                    value: calculatedGrounding.total_kuantitas,
                    isAlign: true,
                  },
                  {
                    col: 'J',
                    value: { formula: '0', result: 0 },
                    isAlign: true,
                  },
                  {
                    col: 'K',
                    value: calculatedGrounding.data_material.harga_material,
                  },
                  {
                    col: 'L',
                    value: calculatedGrounding.data_material.pasang_rab,
                  },
                  { col: 'N', value: calculatedGrounding.total_harga_material },
                  { col: 'O', value: calculatedGrounding.total_pasang },
                  {
                    col: 'Q',
                    value:
                      calculatedGrounding.total_harga_material +
                      calculatedGrounding.total_pasang,
                  },
                ];

                // Apply values and alignments
                for (const { col, value, isAlign } of rowData) {
                  worksheet.getCell(`${col}${previousRow}`).value = value;

                  if (isAlign) {
                    worksheet.getCell(`${col}${previousRow}`).alignment = {
                      horizontal: 'center',
                      vertical: 'middle',
                    };
                  }
                }

                formatWorksheetRow(worksheet, previousRow);
              }
            }
          }
        }

        previousRow += 1;
        formatWorksheetRow(worksheet, previousRow);
      }

      previousRow += 1;
      worksheet.getCell(`C${previousRow}`).value =
        '   ANTI CLIMBING + DANGER PLATE :';
      formatWorksheetRow(worksheet, previousRow);

      const antiClimbing =
        await KonstruksiMaterial.findMaterialForKonstruksiById(38);

      for (const material of antiClimbing) {
        const data = await Material.findMaterialById(material.id);
        previousRow += 1;

        totalAkhirBerat += (Number(data.berat_material) * totalTiang) / 1000;

        const rowData = [
          {
            col: 'B',
            value: data.nomor_material,
          },
          {
            col: 'C',
            value: data.nama_material,
          },
          {
            col: 'D',
            value: data.jenis_material,
            isAlign: true,
          },
          {
            col: 'E',
            value: Number(data.berat_material),
            isAlign: true,
          },
          {
            col: 'F',
            value: data.satuan_material,
            isAlign: true,
          },
          {
            col: 'G',
            value: (Number(data.berat_material) * totalTiang) / 1000,
            isAlign: true,
          },
          {
            col: 'H',
            value: Number(material.kuantitas) * totalTiang,
            isAlign: true,
          },
          {
            col: 'I',
            value: Number(material.kuantitas) * totalTiang,
            isAlign: true,
          },
          {
            col: 'J',
            value: { formula: '0', result: 0 },
            isAlign: true,
          },
          {
            col: 'K',
            value: data.harga_material,
          },
          {
            col: 'L',
            value: data.pasang_rab,
          },
          {
            col: 'N',
            value:
              data.harga_material * (Number(material.kuantitas) * totalTiang),
          },
          {
            col: 'O',
            value: data.pasang_rab * (Number(material.kuantitas) * totalTiang),
          },
          {
            col: 'Q',
            value:
              data.harga_material * (Number(material.kuantitas) * totalTiang) +
              data.pasang_rab * (Number(material.kuantitas) * totalTiang),
          },
        ];

        // Apply values and alignments
        for (const { col, value, isAlign } of rowData) {
          worksheet.getCell(`${col}${previousRow}`).value = value;

          if (isAlign) {
            worksheet.getCell(`${col}${previousRow}`).alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
          }
        }

        formatWorksheetRow(worksheet, previousRow);
      }

      previousRow += 1;
      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      worksheet.getCell(`C${previousRow}`).value = '   CONDUCTOR ACCESSORIES :';
      formatWorksheetRow(worksheet, previousRow);

      const konduktor = konduktorPrices[0].data_konduktor;

      previousRow += 1;

      totalAkhirBerat += konduktorPrices[0].total_berat;

      const rowData = [
        {
          col: 'B',
          value: konduktor.nomor_material,
        },
        {
          col: 'C',
          value: konduktor.nama_material,
        },
        {
          col: 'D',
          value: konduktor.jenis_material,
          isAlign: true,
        },
        {
          col: 'E',
          value: Number(konduktor.berat_material),
          isAlign: true,
        },
        {
          col: 'F',
          value: konduktor.satuan_material,
          isAlign: true,
        },
        {
          col: 'G',
          value: konduktorPrices[0].total_berat,
          isAlign: true,
        },
        {
          col: 'H',
          value: konduktorPrices[0].total_kuantitas,
          isAlign: true,
        },
        {
          col: 'I',
          value: konduktorPrices[0].total_kuantitas,
          isAlign: true,
        },
        {
          col: 'J',
          value: { formula: '0', result: 0 },
          isAlign: true,
        },
        {
          col: 'K',
          value: konduktor.harga_material,
        },
        {
          col: 'L',
          value: konduktor.pasang_rab,
        },
        {
          col: 'N',
          value: konduktorPrices[0].total_harga_material,
        },
        {
          col: 'O',
          value: konduktorPrices[0].total_pasang,
        },
        {
          col: 'Q',
          value:
            konduktorPrices[0].total_harga_material +
            konduktorPrices[0].total_pasang,
        },
      ];

      // Apply values and alignments
      for (const { col, value, isAlign } of rowData) {
        worksheet.getCell(`${col}${previousRow}`).value = value;

        if (isAlign) {
          worksheet.getCell(`${col}${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
        }
      }

      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      formatWorksheetRow(worksheet, previousRow);

      previousRow += 1;
      worksheet.getCell(`C${previousRow}`).value = '   PEKERJAAN PENDUKUNG :';
      formatWorksheetRow(worksheet, previousRow);

      const pekerjaanPendukung = [];

      pekerjaanPendukung.push(
        await Material.findMaterialById(541),
        await Material.findMaterialById(536),
        await Material.findMaterialById(534),
      );

      for (const material of pekerjaanPendukung) {
        previousRow += 1;
        let value = 1;

        if (material.nomor_material === 534) {
          value = totalAkhirBerat;
        }

        const rowData = [
          {
            col: 'B',
            value: material.nomor_material,
          },
          {
            col: 'C',
            value: material.nama_material,
          },
          {
            col: 'D',
            value: material.jenis_material,
            isAlign: true,
          },
          {
            col: 'E',
            value: 0,
            isAlign: true,
          },
          {
            col: 'F',
            value: material.satuan_material,
            isAlign: true,
          },
          {
            col: 'G',
            value: totalAkhirBerat,
            isAlign: true,
          },
          {
            col: 'I',
            value: value,
            isAlign: true,
          },
          {
            col: 'L',
            value: material.pasang_rab,
          },
          {
            col: 'O',
            value: material.pasang_rab * value,
          },
          {
            col: 'Q',
            value: material.pasang_rab * value,
          },
        ];

        // Apply values and alignments
        for (const { col, value, isAlign } of rowData) {
          worksheet.getCell(`${col}${previousRow}`).value = value;

          if (isAlign) {
            worksheet.getCell(`${col}${previousRow}`).alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
          }
        }

        formatWorksheetRow(worksheet, previousRow);
      }

      worksheet.eachRow(row => {
        row.eachCell(cell => {
          cell.font = {
            name: 'Arial',
            size: 12,
          };
        });
      });

      worksheet.getCell('D15').font = { name: 'Arial', size: 12, bold: true };
      worksheet.getCell('B6').font = {
        name: 'Arial',
        size: 12,
        bold: true,
        underline: true,
      };

      const excelBuffer = await workbook.xlsx.writeBuffer();

      return excelBuffer;
    } catch (error) {
      throw error;
    }
  },
};
