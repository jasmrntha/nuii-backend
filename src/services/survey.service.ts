// import path from 'node:path';
//
// eslint-disable-next-line import/no-extraneous-dependencies
import { type SurveyStatus } from '@prisma/client';
// import ExcelJS from 'exceljs';
// import { StatusCodes } from 'http-status-codes';

// import prisma from '../config/prisma';
// import { CustomError } from '../middleware';
import { type CreateSurveyHeaderRequest } from '../models';
// import {
//   type CreateNewSurveyRequest,
//   type CreateSurveyRequest,
//   type UpdateSurveyHeaderRequest,
//   type UpdateSurveyDetailRequest,
//   type CreateNewSurveyBatchRequest,
// } from '../models';
import {
  SurveyHeader,
  // SurveyDetail,
  // Material,
  // Konstruksi,
  // KonstruksiMaterial,
  // TipePekerjaan,
  // PoleRepository,
  // GroundingRepository,
  // PoleMaterialRepository,
  // GroundingMaterialRepository,
} from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SurveyService = {
  async createSurveyHeader(payload: CreateSurveyHeaderRequest) {
    try {
      const header = await SurveyHeader.createHeader(payload);

      return header;
    } catch (error) {
      throw error;
    }
  },
  async getAll(status: SurveyStatus) {
    try {
      return await SurveyHeader.getAll(status, false);
    } catch (error) {
      throw error;
    }
  },
  async getById(id: number) {
    try {
      return await SurveyHeader.getById(id, null, true);
    } catch (error) {
      throw error;
    }
  },
  // async createSurvey(request: CreateSurveyRequest) {
  //   try {
  //     const header = await SurveyHeader.findHeaderById(request.id_header);
  //
  //     if (!header) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Header Not Found');
  //     }
  //
  //     const konstruksi = await Konstruksi.findKonstruksiById(
  //       request.detail.id_konstruksi,
  //     );
  //
  //     if (!konstruksi) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
  //     }
  //
  //     const tiang = await Material.findMaterialById(
  //       request.detail.id_material_tiang,
  //     );
  //
  //     const konduktor = await Material.findMaterialById(
  //       header.id_material_konduktor,
  //     );
  //
  //     if (!tiang || !konduktor) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
  //     }
  //
  //     const { detail } = await prisma.$transaction(async prisma => {
  //       const detail = await SurveyDetail.createDetail(
  //         {
  //           id_material_tiang: request.detail.id_material_tiang,
  //           id_konstruksi: request.detail.id_konstruksi,
  //           id_header: request.id_header,
  //           id_pole_supporter: request.detail.id_pole_supporter
  //             ? Number(request.detail.id_pole_supporter)
  //             : null,
  //           id_grounding_termination: request.detail.id_grounding_termination
  //             ? Number(request.detail.id_grounding_termination)
  //             : null,
  //           nama_pekerjaan: request.detail.nama_pekerjaan,
  //           penyulang: request.detail.penyulang,
  //           panjang_jaringan: request.detail.panjang_jaringan,
  //           long: request.detail.long,
  //           lat: request.detail.lat,
  //           foto: request.detail.foto,
  //           keterangan: request.detail.keterangan,
  //           petugas_survey: request.detail.petugas_survey,
  //         },
  //         prisma,
  //       );
  //
  //       return { detail };
  //     });
  //
  //     const result = {
  //       header: header,
  //       detail: detail,
  //     };
  //
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async createNewSurvey(request: CreateNewSurveyRequest) {
  //   try {
  //     const konstruksi = await Konstruksi.findKonstruksiById(
  //       request.detail.id_konstruksi,
  //     );
  //
  //     if (!konstruksi) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
  //     }
  //
  //     const tiang = await Material.findMaterialById(
  //       request.detail.id_material_tiang,
  //     );
  //
  //     // const konduktor = await Material.findMaterialById(
  //     //   request.detail.id_material_konduktor,
  //     // );
  //
  //     if (!tiang) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
  //     }
  //
  //     const { header, detail } = await prisma.$transaction(async prisma => {
  //       const header = await SurveyHeader.createHeader(
  //         {
  //           nama_survey: request.header.nama_survey,
  //           nama_pekerjaan: request.header.nama_pekerjaan,
  //           lokasi: request.header.lokasi,
  //           user_id: request.header.user_id,
  //           status_survey: request.header.status_survey,
  //           id_material_konduktor: request.header.id_material_konduktor,
  //         },
  //         prisma,
  //       );
  //
  //       const detail = await SurveyDetail.createDetail(
  //         {
  //           id_material_tiang: request.detail.id_material_tiang,
  //           id_konstruksi: request.detail.id_konstruksi,
  //           id_header: header.id,
  //           id_pole_supporter: request.detail.id_pole_supporter
  //             ? Number(request.detail.id_pole_supporter)
  //             : null,
  //           id_grounding_termination: request.detail.id_grounding_termination
  //             ? Number(request.detail.id_grounding_termination)
  //             : null,
  //           nama_pekerjaan: request.detail.nama_pekerjaan,
  //           penyulang: request.detail.penyulang,
  //           panjang_jaringan: request.detail.panjang_jaringan,
  //           long: request.detail.long,
  //           lat: request.detail.lat,
  //           foto: request.detail.foto,
  //           keterangan: request.detail.keterangan,
  //           petugas_survey: request.detail.petugas_survey,
  //         },
  //         prisma,
  //       );
  //
  //       return { header, detail };
  //     });
  //
  //     const result = {
  //       header: header,
  //       detail: detail,
  //     };
  //
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async updateSurveyHeader(request: UpdateSurveyHeaderRequest) {
  //   try {
  //     const header = await SurveyHeader.findHeaderById(request.id_header);
  //
  //     if (!header) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Header Not Found');
  //     }
  //
  //     const { result } = await prisma.$transaction(async prisma => {
  //       const result = await SurveyHeader.updateHeader(
  //         request.id_header,
  //         {
  //           nama_survey: request.header.nama_survey,
  //           nama_pekerjaan: request.header.nama_pekerjaan,
  //           lokasi: request.header.lokasi,
  //           user_id: request.header.user_id,
  //           status_survey: request.header.status_survey,
  //           id_material_konduktor: request.header.id_material_konduktor,
  //         },
  //         prisma,
  //       );
  //
  //       return { result };
  //     });
  //
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async updateSurveyDetail(request: UpdateSurveyDetailRequest) {
  //   try {
  //     const detail = await SurveyDetail.findDetailById(request.id_detail);
  //
  //     if (!detail) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Detail Not Found');
  //     }
  //
  //     const konstruksi = await Konstruksi.findKonstruksiById(
  //       request.detail.id_konstruksi,
  //     );
  //
  //     if (!konstruksi) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
  //     }
  //
  //     const tiang = await Material.findMaterialById(
  //       request.detail.id_material_tiang,
  //     );
  //
  //     // const konduktor = await Material.findMaterialById(
  //     //   request.detail.id_material_konduktor,
  //     // );
  //
  //     if (!tiang) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
  //     }
  //
  //     const { result } = await prisma.$transaction(async prisma => {
  //       const result = await SurveyDetail.updateDetail(
  //         request.id_detail,
  //         {
  //           id_material_tiang: request.detail.id_material_tiang,
  //           id_konstruksi: request.detail.id_konstruksi,
  //           id_header: request.detail.id_header,
  //           id_pole_supporter: request.detail.id_pole_supporter
  //             ? Number(request.detail.id_pole_supporter)
  //             : null,
  //           id_grounding_termination: request.detail.id_grounding_termination
  //             ? Number(request.detail.id_grounding_termination)
  //             : null,
  //           penyulang: request.detail.penyulang,
  //           panjang_jaringan: request.detail.panjang_jaringan,
  //           long: request.detail.long,
  //           lat: request.detail.lat,
  //           foto: request.detail.foto,
  //           keterangan: request.detail.keterangan,
  //           petugas_survey: request.detail.petugas_survey,
  //         },
  //         prisma,
  //       );
  //
  //       return { result };
  //     });
  //
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async exportSurvey(id: number) {
  //   try {
  //     // Step 1: Get the survey header and its details
  //     const survey = await SurveyHeader.exportHeaderById(id);
  //
  //     if (!survey) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
  //     }
  //
  //     const details = await SurveyDetail.exportDetailByHeaderId(survey.id);
  //
  //     if (!details || details.length === 0) {
  //       throw new CustomError(
  //         StatusCodes.NOT_FOUND,
  //         'Survey Details Not Found',
  //       );
  //     }
  //
  //     // Step 2: Count the amount of each unique id_konstruksi and id_material_tiang
  //     const konstruksiCount: Record<number, number> = {};
  //     const tiangCount: Record<number, number> = {};
  //     const konduktorCount: Record<number, number> = {};
  //     const poleCount: Record<number, number> = {};
  //     const groundingCount: Record<number, Record<number, number>> = {}; // Fix: Use a nested object
  //
  //     for (const detail of details) {
  //       if (!konstruksiCount[detail.id_konstruksi]) {
  //         konstruksiCount[detail.id_konstruksi] = 0;
  //       }
  //
  //       konstruksiCount[detail.id_konstruksi]++;
  //
  //       if (!tiangCount[detail.id_material_tiang]) {
  //         tiangCount[detail.id_material_tiang] = 0;
  //       }
  //
  //       tiangCount[detail.id_material_tiang]++;
  //
  //       if (!konduktorCount[survey.id_material_konduktor]) {
  //         konduktorCount[survey.id_material_konduktor] = 0;
  //       }
  //
  //       konduktorCount[survey.id_material_konduktor] += detail.panjang_jaringan;
  //
  //       if (detail.id_pole_supporter) {
  //         if (!poleCount[detail.id_pole_supporter]) {
  //           poleCount[detail.id_pole_supporter] = 0;
  //         }
  //
  //         poleCount[detail.id_pole_supporter]++;
  //       }
  //
  //       if (detail.id_grounding_termination) {
  //         if (!groundingCount[detail.id_grounding_termination]) {
  //           groundingCount[detail.id_grounding_termination] = {}; // Fix: Ensure it's an object
  //         }
  //
  //         if (
  //           !groundingCount[detail.id_grounding_termination][
  //             detail.id_konstruksi
  //           ]
  //         ) {
  //           groundingCount[detail.id_grounding_termination][
  //             detail.id_konstruksi
  //           ] = 0;
  //         }
  //
  //         groundingCount[detail.id_grounding_termination][
  //           detail.id_konstruksi
  //         ]++;
  //       }
  //     }
  //
  //     // Step 3: Get all materials required and the amount for each unique konstruksi and tiang
  //     const konstruksiMaterials = await Promise.all(
  //       Object.keys(konstruksiCount).map(async key => {
  //         const idKonstruksi = Number(key);
  //         const materials =
  //           await KonstruksiMaterial.findMaterialForKonstruksiById(
  //             idKonstruksi,
  //           );
  //
  //         return { idKonstruksi, materials };
  //       }),
  //     );
  //
  //     const tiangMaterials = await Promise.all(
  //       Object.keys(tiangCount).map(async key => {
  //         const idMaterialTiang = Number(key);
  //         const materials = await Material.findMaterialById(idMaterialTiang);
  //
  //         return { idMaterialTiang, materials };
  //       }),
  //     );
  //
  //     const konduktorMaterials = await Promise.all(
  //       Object.keys(konduktorCount).map(async key => {
  //         const idKonduktor = Number(key);
  //         const materials = await Material.findMaterialById(idKonduktor);
  //
  //         return { idKonduktor, materials };
  //       }),
  //     );
  //
  //     const poleMaterials = await Promise.all(
  //       Object.keys(poleCount).map(async key => {
  //         const idPole = Number(key);
  //         const materials =
  //           await PoleMaterialRepository.getPoleMaterialsByPoleId(idPole);
  //
  //         return materials.length > 0 ? { idPole, materials } : null;
  //       }),
  //     );
  //
  //     poleMaterials.filter(Boolean); // Remove null values
  //
  //     const groundingMaterials = await Promise.all(
  //       Object.keys(groundingCount).map(async key => {
  //         const idGrounding = Number(key);
  //         const materials =
  //           await GroundingMaterialRepository.getGroundingMaterialsByGroundingId(
  //             idGrounding,
  //           );
  //
  //         const idKonstruksi = Object.keys(groundingCount[idGrounding]).map(
  //           Number,
  //         );
  //
  //         return { idGrounding, idKonstruksi, materials };
  //       }),
  //     );
  //
  //     // Step 4: Calculate the total price of each material for each unique konstruksi
  //     const totalPrices = await Promise.all(
  //       konstruksiMaterials.map(async ({ idKonstruksi, materials }) => {
  //         const dataKonstruksi =
  //           await Konstruksi.findKonstruksiById(idKonstruksi);
  //         const materialPrices = await Promise.all(
  //           materials.map(async material => {
  //             const materialData = await Material.findMaterialById(
  //               material.id_material,
  //             );
  //             const tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
  //               material.id_tipe_pekerjaan,
  //             );
  //             const totalHargaMaterial =
  //               materialData.harga_material *
  //               Number(material.kuantitas) *
  //               konstruksiCount[idKonstruksi];
  //
  //             const totalPasang =
  //               materialData.pasang_rab *
  //               Number(material.kuantitas) *
  //               konstruksiCount[idKonstruksi];
  //
  //             const totalBongkar =
  //               materialData.bongkar * konstruksiCount[idKonstruksi];
  //
  //             const totalBerat =
  //               (Number(materialData.berat_material) *
  //                 Number(material.kuantitas) *
  //                 konstruksiCount[idKonstruksi]) /
  //               1000;
  //
  //             return {
  //               data_material: { ...materialData },
  //               tipe_pekerjaan: tipePekerjaan.tipe_pekerjaan,
  //               kuantitas: material.kuantitas,
  //               total_kuantitas:
  //                 Number(material.kuantitas) * konstruksiCount[idKonstruksi],
  //               total_berat: totalBerat,
  //               total_harga_material: totalHargaMaterial,
  //               total_pasang: totalPasang,
  //               total_bongkar: totalBongkar,
  //             };
  //           }),
  //         );
  //
  //         return {
  //           idKonstruksi,
  //           data_konstruksi: dataKonstruksi,
  //           materials: materialPrices,
  //           detail_grounding: [] as any[], // Initialize detail_grounding as an empty array
  //         };
  //       }),
  //     );
  //
  //     // Step 5: Calculate the total price of each tiang material
  //     const tiangPrices = await Promise.all(
  //       tiangMaterials.map(({ idMaterialTiang, materials }) => {
  //         const materialData = materials;
  //         const totalHargaMaterial =
  //           materialData.harga_material * tiangCount[idMaterialTiang];
  //
  //         const totalPasang =
  //           materialData.pasang_rab * tiangCount[idMaterialTiang];
  //
  //         const totalBongkar =
  //           materialData.bongkar * tiangCount[idMaterialTiang];
  //
  //         const totalBerat =
  //           (Number(materialData.berat_material) *
  //             tiangCount[idMaterialTiang]) /
  //           1000;
  //
  //         return {
  //           data_tiang: { ...materialData },
  //           total_kuantitas: tiangCount[idMaterialTiang],
  //           total_berat: totalBerat,
  //           total_harga_material: totalHargaMaterial,
  //           total_pasang: totalPasang,
  //           total_bongkar: totalBongkar,
  //         };
  //       }),
  //     );
  //
  //     const konduktorPrices = await Promise.all(
  //       konduktorMaterials.map(({ idKonduktor, materials }) => {
  //         const materialData = materials;
  //
  //         let multiplier = materials.nomor_material === 5 ? 3.045 : 3.06;
  //
  //         if (materials.nomor_material === 77) {
  //           multiplier = 1;
  //         }
  //
  //         const totalConductor = (konduktorCount[idKonduktor] * multiplier) / 1;
  //
  //         const totalHargaMaterial =
  //           materialData.harga_material * totalConductor;
  //
  //         const totalPasang = materialData.pasang_rab * totalConductor;
  //
  //         const totalBongkar = materialData.bongkar * totalConductor;
  //
  //         const totalBerat =
  //           (Number(materialData.berat_material) * totalConductor) / 1000;
  //
  //         return {
  //           data_konduktor: { ...materialData },
  //           total_kuantitas: totalConductor,
  //           total_berat: totalBerat,
  //           total_harga_material: totalHargaMaterial,
  //           total_pasang: totalPasang,
  //           total_bongkar: totalBongkar,
  //         };
  //       }),
  //     );
  //
  //     const polePrices = await Promise.all(
  //       poleMaterials.map(async ({ idPole, materials }) => {
  //         const dataPole = await PoleRepository.getPoleById(idPole);
  //         const materialPrices = await Promise.all(
  //           materials.map(async material => {
  //             const materialData = await Material.findMaterialById(
  //               material.id_material,
  //             );
  //
  //             let tipePekerjaan = null;
  //
  //             if (material.id_tipe_pekerjaan) {
  //               tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
  //                 material.id_tipe_pekerjaan,
  //               );
  //             }
  //
  //             const totalHargaMaterial =
  //               materialData.harga_material *
  //               Number(material.kuantitas) *
  //               poleCount[idPole];
  //
  //             const totalPasang =
  //               materialData.pasang_rab *
  //               Number(material.kuantitas) *
  //               poleCount[idPole];
  //
  //             const totalBongkar = materialData.bongkar * poleCount[idPole];
  //
  //             const totalBerat =
  //               (Number(materialData.berat_material) *
  //                 Number(material.kuantitas) *
  //                 poleCount[idPole]) /
  //               1000;
  //
  //             return {
  //               data_material: { ...materialData },
  //               tipe_pekerjaan: tipePekerjaan
  //                 ? tipePekerjaan.tipe_pekerjaan
  //                 : '',
  //               kuantitas: material.kuantitas,
  //               total_kuantitas: Number(material.kuantitas) * poleCount[idPole],
  //               total_berat: totalBerat,
  //               total_harga_material: totalHargaMaterial,
  //               total_pasang: totalPasang,
  //               total_bongkar: totalBongkar,
  //             };
  //           }),
  //         );
  //
  //         return {
  //           idPole,
  //           data_pole: {
  //             id: dataPole.id,
  //             nama_pole_supporter: dataPole.nama_pole,
  //             created_at: dataPole.created_at,
  //             updated_at: dataPole.updated_at,
  //             deleted_at: dataPole.deleted_at,
  //           },
  //           materials: materialPrices,
  //         };
  //       }),
  //     );
  //
  //     const groundingPrices = await Promise.all(
  //       groundingMaterials.map(
  //         async ({ idGrounding, idKonstruksi, materials }) => {
  //           // Sum all counts for the given `idGrounding`
  //           const totalGroundingCount = groundingCount[idGrounding]
  //             ? Object.values(groundingCount[idGrounding]).reduce(
  //                 (accumulator, count) => accumulator + count,
  //                 0,
  //               )
  //             : 0;
  //
  //           const dataGrounding =
  //             await GroundingRepository.getGroundingById(idGrounding);
  //
  //           const materialPrices = await Promise.all(
  //             materials.map(async material => {
  //               const materialData = await Material.findMaterialById(
  //                 material.id_material,
  //               );
  //               const tipePekerjaan = await TipePekerjaan.findTipePekerjaanById(
  //                 material.id_tipe_pekerjaan,
  //               );
  //
  //               const totalKuantitas =
  //                 Number(material.kuantitas) * totalGroundingCount;
  //               const totalHargaMaterial =
  //                 materialData.harga_material * totalKuantitas;
  //               const totalPasang = materialData.pasang_rab * totalKuantitas;
  //               const totalBongkar = materialData.bongkar * totalGroundingCount;
  //               const totalBerat =
  //                 (Number(materialData.berat_material) * totalKuantitas) / 1000;
  //
  //               return {
  //                 data_material: { ...materialData },
  //                 tipe_pekerjaan: tipePekerjaan.tipe_pekerjaan,
  //                 kuantitas: material.kuantitas,
  //                 total_kuantitas: totalKuantitas,
  //                 total_berat: totalBerat,
  //                 total_harga_material: totalHargaMaterial,
  //                 total_pasang: totalPasang,
  //                 total_bongkar: totalBongkar,
  //               };
  //             }),
  //           );
  //
  //           return idKonstruksi.map(konstruksiId => ({
  //             idGrounding,
  //             idKonstruksi: konstruksiId, // Now explicitly associating each grounding with a konstruksi
  //             data_grounding: dataGrounding,
  //             materials: materialPrices,
  //           }));
  //         },
  //       ),
  //     );
  //
  //     for (const total of totalPrices) {
  //       for (const groundingArray of groundingPrices) {
  //         for (const grounding of groundingArray) {
  //           if (total.idKonstruksi === grounding.idKonstruksi) {
  //             total.detail_grounding.push(grounding);
  //           }
  //         }
  //       }
  //     }
  //
  //     const enrichedDetails = await Promise.all(
  //       details.map(detail => ({
  //         id: detail.id,
  //         id_material_tiang: detail.id_material_tiang,
  //         id_konstruksi: detail.id_konstruksi,
  //         id_pole_supporter: detail.id_pole_supporter,
  //         id_grounding_termination: detail.id_grounding_termination,
  //         penyulang: detail.penyulang,
  //         panjang_jaringan: detail.panjang_jaringan,
  //         long: detail.long,
  //         lat: detail.lat,
  //         foto: detail.foto,
  //         keterangan: detail.keterangan,
  //         petugas_survey: detail.petugas_survey,
  //       })),
  //     );
  //
  //     return {
  //       data_survey: {
  //         ...survey,
  //         survey_details: enrichedDetails,
  //       },
  //       detail_poles: polePrices,
  //       detail_tiang: tiangPrices,
  //       detail_konstruksi: totalPrices,
  //       detail_konduktor: konduktorPrices,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async deleteSurveyDetail(id: number) {
  //   try {
  //     const detail = await SurveyDetail.findDetailById(id);
  //
  //     if (!detail) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Detail Not Found');
  //     }
  //
  //     const header = await SurveyHeader.findHeaderById(detail.id_header);
  //
  //     if (!header) {
  //       throw new CustomError(
  //         StatusCodes.METHOD_NOT_ALLOWED,
  //         'Survey Header for this Detail is already accepted. Unable to Delete.',
  //       );
  //     }
  //
  //     const deleteSurvey = await SurveyDetail.deleteDetail(id);
  //
  //     return deleteSurvey;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async deleteSurvey(id: number) {
  //   try {
  //     const survey = await SurveyHeader.findHeaderById(id);
  //
  //     if (!survey) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
  //     }
  //
  //     const getDetails = await SurveyDetail.detailByHeaderId(id);
  //
  //     if (getDetails.length > 0) {
  //       for (const detail of getDetails) {
  //         await SurveyDetail.deleteDetail(detail.id);
  //       }
  //     }
  //
  //     const deleteSurvey = await SurveyHeader.deleteSurvey(id);
  //
  //     return deleteSurvey;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async getSurveyNameList() {
  //   try {
  //     const getNames = await SurveyHeader.getSurveyNameList();
  //
  //     if (getNames.length === 0) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
  //     }
  //
  //     return getNames;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async getAllSurveyHeader() {
  //   try {
  //     const getHeader = await SurveyHeader.getHeaderOnly();
  //
  //     if (getHeader.length === 0) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
  //     }
  //
  //     return getHeader;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async getSurveyDetail(id: number) {
  //   try {
  //     const getHeader = await SurveyHeader.getSurveyHeader(id);
  //
  //     if (!getHeader) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
  //     }
  //
  //     const getDetail = await SurveyDetail.detailByHeaderId(id);
  //
  //     if (getDetail.length === 0) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Detail Not Found');
  //     }
  //
  //     const totalPanjangJaringan = getDetail.reduce(
  //       (sum, detail) => sum + detail.panjang_jaringan,
  //       0,
  //     );
  //
  //     let totalPanjangJaringanCalculated = 0;
  //
  //     for (let index = 0; index < getDetail.length - 1; index++) {
  //       const detail = getDetail[index];
  //       const nextDetail = getDetail[index + 1];
  //       totalPanjangJaringanCalculated += countDistance(
  //         Number(detail.lat),
  //         Number(detail.long),
  //         Number(nextDetail.lat),
  //         Number(nextDetail.long),
  //       );
  //     }
  //
  //     const enrichedDetails = await Promise.all(
  //       getDetail.map(async detail => {
  //         const materialTiang = await Material.findMaterialById(
  //           detail.id_material_tiang,
  //         );
  //         const konstruksi = await Konstruksi.findKonstruksiById(
  //           detail.id_konstruksi,
  //         );
  //         const poleSupporter = detail.id_pole_supporter
  //           ? await PoleRepository.getPoleById(detail.id_pole_supporter)
  //           : null;
  //         const groundingTermination = detail.id_grounding_termination
  //           ? await GroundingMaterialRepository.getGroudingById(
  //               detail.id_grounding_termination,
  //             )
  //           : null;
  //
  //         return {
  //           id: detail.id,
  //           id_material_tiang: detail.id_material_tiang,
  //           nama_material_tiang: materialTiang.nama_material || null,
  //           id_konstruksi: detail.id_konstruksi,
  //           nama_konstruksi: konstruksi.nama_konstruksi || null,
  //           id_header: detail.id_header,
  //           id_pole_supporter: detail.id_pole_supporter,
  //           nama_pole_supporter: poleSupporter?.nama_pole || null,
  //           id_grounding_termination: detail.id_grounding_termination,
  //           nama_grounding_termination:
  //             groundingTermination?.nama_grounding || null,
  //           penyulang: detail.penyulang,
  //           panjang_jaringan: detail.panjang_jaringan,
  //           long: detail.long,
  //           lat: detail.lat,
  //           foto: detail.foto,
  //           keterangan: detail.keterangan,
  //           petugas_survey: detail.petugas_survey,
  //           created_at: detail.created_at,
  //           updated_at: detail.updated_at,
  //           deleted_at: detail.deleted_at,
  //         };
  //       }),
  //     );
  //
  //     return {
  //       header: {
  //         ...getHeader,
  //         total_panjang_jaringan_manual: totalPanjangJaringan,
  //         total_panjang_jaringan_otomatis: totalPanjangJaringanCalculated,
  //       },
  //       detail: enrichedDetails,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  //
  // async getAllReport() {
  //   try {
  //     const getReport = await SurveyHeader.getAllReportWithExcel();
  //
  //     if (getReport.length === 0) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Report Not Found');
  //     }
  //
  //     return getReport;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async getReportDetail(id: number) {
  //   try {
  //     const getHeader = await SurveyHeader.getReportById(id);
  //
  //     if (!getHeader) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Report Not Found');
  //     }
  //
  //     const getDetail = await SurveyDetail.detailByHeaderId(id);
  //
  //     if (getDetail.length === 0) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Report Detail Not Found');
  //     }
  //
  //     const totalPanjangJaringan = getDetail.reduce(
  //       (sum, detail) => sum + detail.panjang_jaringan,
  //       0,
  //     );
  //
  //     let totalPanjangJaringanCalculated = 0;
  //
  //     for (let index = 0; index < getDetail.length - 1; index++) {
  //       const detail = getDetail[index];
  //       const nextDetail = getDetail[index + 1];
  //       totalPanjangJaringanCalculated += countDistance(
  //         Number(detail.lat),
  //         Number(detail.long),
  //         Number(nextDetail.lat),
  //         Number(nextDetail.long),
  //       );
  //     }
  //
  //     const enrichedDetails = await Promise.all(
  //       getDetail.map(async detail => {
  //         const materialTiang = await Material.findMaterialById(
  //           detail.id_material_tiang,
  //         );
  //         const konstruksi = await Konstruksi.findKonstruksiById(
  //           detail.id_konstruksi,
  //         );
  //         const poleSupporter = detail.id_pole_supporter
  //           ? await PoleRepository.getPoleById(detail.id_pole_supporter)
  //           : null;
  //         const groundingTermination = detail.id_grounding_termination
  //           ? await GroundingMaterialRepository.getGroudingById(
  //               detail.id_grounding_termination,
  //             )
  //           : null;
  //
  //         return {
  //           id: detail.id,
  //           id_material_tiang: detail.id_material_tiang,
  //           nama_material_tiang: materialTiang.nama_material || null,
  //           id_konstruksi: detail.id_konstruksi,
  //           nama_konstruksi: konstruksi.nama_konstruksi || null,
  //           id_header: detail.id_header,
  //           id_pole_supporter: detail.id_pole_supporter,
  //           nama_pole_supporter: poleSupporter?.nama_pole || null,
  //           id_grounding_termination: detail.id_grounding_termination,
  //           nama_grounding_termination:
  //             groundingTermination?.nama_grounding || null,
  //           penyulang: detail.penyulang,
  //           panjang_jaringan: detail.panjang_jaringan,
  //           long: detail.long,
  //           lat: detail.lat,
  //           foto: detail.foto,
  //           keterangan: detail.keterangan,
  //           petugas_survey: detail.petugas_survey,
  //           created_at: detail.created_at,
  //           updated_at: detail.updated_at,
  //           deleted_at: detail.deleted_at,
  //         };
  //       }),
  //     );
  //
  //     return {
  //       header: {
  //         ...getHeader,
  //         total_panjang_jaringan_manual: totalPanjangJaringan,
  //         total_panjang_jaringan_otomatis: totalPanjangJaringanCalculated,
  //       },
  //       detail: enrichedDetails,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};
