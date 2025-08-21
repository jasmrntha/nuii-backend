import { SurveyStatus } from '@prisma/client';
import ExcelJS from 'exceljs';
import { StatusCodes } from 'http-status-codes';

import prisma from '../config/prisma';
import {
  CustomError,
  writeCubicleSheet,
  writeSutmSheet,
  type ICubiclePrice,
  type IGroundingPrice,
  type IKonduktorPrice,
  type IKonstruksiPrice,
  type IPolePrice,
  type ITiangPrice,
} from '../middleware';
import { type UploadExcelRequest } from '../models';
import { ExcelArchive, SurveyHeader } from '../repositories';

interface ISutmCounts {
  konstruksi: Record<number, any>;
  tiang: Record<number, any>;
  konduktor: Record<number, any>;
  pole: Record<number, any>;
  grounding: Record<number, any>;
}

async function countSutm(survey: any): Promise<ISutmCounts> {
  const sutmDetails: {
    id_konstruksi: number;
    id_material_tiang: number;
    id_pole_supporter: number;
    id_grounding_termination: number;
    panjang_jaringan: number;
  }[] = survey.sutm_surveys.flatMap((s: any) => s.sutm_details);

  const konstruksiIds = [
    ...new Set(sutmDetails.map((d: any) => d.id_konstruksi)),
  ] as number[];
  const tiangIds = [
    ...new Set(sutmDetails.map((d: any) => d.id_material_tiang)),
  ] as number[];
  const konduktorIds = [
    ...new Set(survey.sutm_surveys.map((s: any) => s.id_material_konduktor)),
  ] as number[];
  const poleIds = [
    ...new Set(
      sutmDetails.map((d: any) => d.id_pole_supporter).filter(Boolean),
    ),
  ] as number[];
  const groundingIds = [
    ...new Set(
      sutmDetails.map((d: any) => d.id_grounding_termination).filter(Boolean),
    ),
  ] as number[];

  const [konstruksiData, tiangData, konduktorData, poleData, groundingData] =
    await prisma.$transaction([
      prisma.konstruksi.findMany({
        where: { id: { in: konstruksiIds } },
        include: {
          konstruksi_materials: {
            include: { material: true, tipe_pekerjaan: true },
          },
        },
      }),
      prisma.material.findMany({ where: { id: { in: tiangIds } } }),
      prisma.material.findMany({ where: { id: { in: konduktorIds } } }),
      prisma.poleSupporter.findMany({
        where: { id: { in: poleIds } },
        include: {
          pole_materials: { include: { material: true, tipe_pekerjaan: true } },
        },
      }),
      prisma.groundingTermination.findMany({
        where: { id: { in: groundingIds } },
        include: {
          GroundingMaterial: {
            include: { material: true, tipe_pekerjaan: true },
          },
        },
      }),
    ]);

  const konstruksiMap = new Map(konstruksiData.map(k => [k.id, k]));
  const tiangMap = new Map(tiangData.map(t => [t.id, t]));
  const konduktorMap = new Map(konduktorData.map(k => [k.id, k]));
  const poleMap = new Map(poleData.map(p => [p.id, p]));
  const groundingMap = new Map(groundingData.map(g => [g.id, g]));

  const counts: ISutmCounts = {
    konstruksi: {},
    tiang: {},
    konduktor: {},
    pole: {},
    grounding: {},
  };

  for (const detail of sutmDetails) {
    // Konstruksi
    if (!counts.konstruksi[detail.id_konstruksi]) {
      counts.konstruksi[detail.id_konstruksi] = {
        ...konstruksiMap.get(detail.id_konstruksi),
        count: 0,
      };
    }

    counts.konstruksi[detail.id_konstruksi].count++;

    // Tiang
    if (!counts.tiang[detail.id_material_tiang]) {
      counts.tiang[detail.id_material_tiang] = {
        ...tiangMap.get(detail.id_material_tiang),
        count: 0,
      };
    }

    counts.tiang[detail.id_material_tiang].count++;

    // Pole Supporter
    if (detail.id_pole_supporter) {
      if (!counts.pole[detail.id_pole_supporter]) {
        counts.pole[detail.id_pole_supporter] = {
          ...poleMap.get(detail.id_pole_supporter),
          count: 0,
        };
      }

      counts.pole[detail.id_pole_supporter].count++;
    }

    // Grounding
    if (detail.id_grounding_termination) {
      if (!counts.grounding[detail.id_grounding_termination]) {
        counts.grounding[detail.id_grounding_termination] = {
          ...groundingMap.get(detail.id_grounding_termination),
          count: 0,
          konstruksi: {},
        };
      }

      counts.grounding[detail.id_grounding_termination].count++;

      if (
        !counts.grounding[detail.id_grounding_termination].konstruksi[
          detail.id_konstruksi
        ]
      ) {
        counts.grounding[detail.id_grounding_termination].konstruksi[
          detail.id_konstruksi
        ] = 0;
      }

      counts.grounding[detail.id_grounding_termination].konstruksi[
        detail.id_konstruksi
      ]++;
    }
  }

  for (const sutmSurvey of survey.sutm_surveys) {
    if (!counts.konduktor[sutmSurvey.id_material_konduktor]) {
      counts.konduktor[sutmSurvey.id_material_konduktor] = {
        ...konduktorMap.get(sutmSurvey.id_material_konduktor),
        totalPanjang: 0,
      };
    }

    counts.konduktor[sutmSurvey.id_material_konduktor].totalPanjang +=
      sutmSurvey.sutm_details.reduce(
        (accumulator: number, detail: { panjang_jaringan: number }) =>
          accumulator + detail.panjang_jaringan,
        0,
      );
  }

  return counts;
}

function calculateMaterialPrices(
  material: any,
  kuantitas: number,
  count: number,
) {
  const totalKuantitas = kuantitas * count;
  const totalHargaMaterial = material.harga_material * totalKuantitas;
  const totalPasang = material.pasang_rab * totalKuantitas;
  const totalBongkar = material.bongkar * count;
  const totalBerat = (Number(material.berat_material) * totalKuantitas) / 1000;

  return {
    ...material,
    total_kuantitas: totalKuantitas,
    total_berat: totalBerat,
    total_harga_material: totalHargaMaterial,
    total_pasang: totalPasang,
    total_bongkar: totalBongkar,
  };
}

async function countCubicle(survey: any) {
  const cubicleDetails: {
    id: number;
    id_cubicle_material: number;
    cubicle_type: string;
    AppTmComponent: any[];
  }[] = survey.cubicle_surveys;

  const cubicleIds = [
    ...new Set(cubicleDetails.map((d: any) => d.id_cubicle_material)),
  ] as number[];

  const cubicleData = await prisma.material.findMany({
    where: { id: { in: cubicleIds } },
  });

  const cubicleMap = new Map(cubicleData.map(c => [c.id, c]));

  const counts: Record<string, any> = {};

  for (const detail of cubicleDetails) {
    if (!counts[detail.id_cubicle_material]) {
      counts[detail.id_cubicle_material] = {
        ...cubicleMap.get(detail.id_cubicle_material),
        count: 0,
        materials: {},
      };
    }

    counts[detail.id_cubicle_material].count++;

    for (const component of detail.AppTmComponent) {
      if (
        !counts[detail.id_cubicle_material].materials[component.id_material]
      ) {
        counts[detail.id_cubicle_material].materials[component.id_material] = {
          ...component.material,
          count: 0,
        };
      }

      counts[detail.id_cubicle_material].materials[component.id_material]
        .count++;
    }
  }

  return counts;
}

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

  async exportSurveyToExcel(id: number) {
    try {
      // Step 1: Get the survey header and its details
      const survey = await SurveyHeader.getDeep(id, null, true);

      if (!survey) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Not Found');
      }

      const isCubicle = survey.cubicle_surveys.length > 0 ? true : false;
      const isSutm = survey.sutm_surveys.length > 0 ? true : false;
      const isSktm = survey.sktm_surveys.length > 0 ? true : false;

      const sutmCounts: ISutmCounts = isSutm ? await countSutm(survey) : null;

      const totalPrices: IKonstruksiPrice[] = Object.values(
        sutmCounts.konstruksi,
      ).map((konstruksi: any) => ({
        ...konstruksi,
        materials: konstruksi.konstruksi_materials.map((material: any) =>
          calculateMaterialPrices(
            material.material,
            Number(material.kuantitas),
            konstruksi.count,
          ),
        ),
      }));

      const tiangPrices: ITiangPrice[] = Object.values(sutmCounts.tiang).map(
        (tiang: any) => calculateMaterialPrices(tiang, 1, tiang.count),
      );

      const konduktorPrices: IKonduktorPrice[] = Object.values(
        sutmCounts.konduktor,
      ).map((konduktor: any) => {
        let multiplier = konduktor.nomor_material === 5 ? 3.045 : 3.06;

        if (konduktor.nomor_material === 77) {
          multiplier = 1;
        }

        const totalConductor = (konduktor.totalPanjang * multiplier) / 1;
        const totalHargaMaterial = konduktor.harga_material * totalConductor;
        const totalPasang = konduktor.pasang_rab * totalConductor;
        const totalBongkar = konduktor.bongkar * totalConductor;
        const totalBerat =
          (Number(konduktor.berat_material) * totalConductor) / 1000;

        return {
          data_konduktor: { ...konduktor },
          total_kuantitas: totalConductor,
          total_berat: totalBerat,
          total_harga_material: totalHargaMaterial,
          total_pasang: totalPasang,
          total_bongkar: totalBongkar,
        };
      });

      const polePrices: IPolePrice[] = Object.values(sutmCounts.pole).map(
        (pole: any) => ({
          ...pole,
          materials: pole.pole_materials.map((material: any) =>
            calculateMaterialPrices(
              material.material,
              Number(material.kuantitas),
              pole.count,
            ),
          ),
        }),
      );

      const groundingPrices: IGroundingPrice[] = Object.values(
        sutmCounts.grounding,
      ).flatMap((grounding: any) => {
        const materials = grounding.GroundingMaterial.map((material: any) =>
          calculateMaterialPrices(
            material.material,
            Number(material.kuantitas),
            grounding.count,
          ),
        );

        return Object.keys(grounding.konstruksi).map(konstruksiId => ({
          ...grounding,
          idKonstruksi: Number(konstruksiId),
          materials,
        }));
      });

      const flattenedGroundingPrices = groundingPrices.flat();

      const cubicleCounts = isCubicle ? await countCubicle(survey) : null;

      const cubiclePrices: ICubiclePrice[] = Object.values(cubicleCounts).map(
        (cubicle: any) => ({
          ...cubicle,
          materials: Object.values(cubicle.materials).map((material: any) =>
            calculateMaterialPrices(material, 1, material.count),
          ),
        }),
      );

      // Step 3: Get all materials required and the amount for each unique konstruksi and tiang

      // Step 4: Calculate the total price of each material for each unique konstruksi

      const workbook = new ExcelJS.Workbook();
      workbook.addWorksheet('REKAP');
      const cubicle = isCubicle ? workbook.addWorksheet('CUBICLE') : null;
      const sutm = isSutm ? workbook.addWorksheet('SUTM') : null;
      isSktm ? workbook.addWorksheet('SKTM') : null;
      isCubicle ? workbook.addWorksheet('APP TM') : null;

      if (sutm) {
        await writeSutmSheet(
          sutm,
          survey,
          tiangPrices,
          polePrices,
          totalPrices,
          flattenedGroundingPrices,
          konduktorPrices,
          workbook,
        );
      }

      if (cubicle) {
        await writeCubicleSheet(cubicle, survey, cubiclePrices, workbook);
      }

      const excelBuffer = await workbook.xlsx.writeBuffer();

      return excelBuffer;
    } catch (error) {
      throw error;
    }
  },

  // async createSurveyBatch(request: CreateNewSurveyBatchRequest) {
  //   try {
  //     const konstruksi = await Konstruksi.findKonstruksiById(
  //       request.details[0].id_konstruksi,
  //     );
  //
  //     if (!konstruksi) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Konstruksi Not Found');
  //     }
  //
  //     const tiang = await Material.findMaterialById(
  //       request.details[0].id_material_tiang,
  //     );
  //
  //     if (!tiang) {
  //       throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
  //     }
  //
  //     const result = await prisma.$transaction(async prisma => {
  //       const header = await SurveyHeader.createHeaderEstimasi(
  //         {
  //           nama_survey: request.header.nama_survey,
  //           nama_pekerjaan: request.header.nama_pekerjaan,
  //           lokasi: request.header.lokasi,
  //           user_id: request.header.user_id,
  //           id_material_konduktor: request.header.id_material_konduktor,
  //         },
  //         prisma,
  //       );
  //
  //       const detailsData = request.details.map(detail => ({
  //         id_material_tiang: detail.id_material_tiang,
  //         id_konstruksi: detail.id_konstruksi,
  //         id_header: header.id,
  //         id_pole_supporter: detail.id_pole_supporter
  //           ? Number(detail.id_pole_supporter)
  //           : null,
  //         id_grounding_termination: detail.id_grounding_termination
  //           ? Number(detail.id_grounding_termination)
  //           : null,
  //         nama_pekerjaan: detail.nama_pekerjaan,
  //         penyulang: detail.penyulang,
  //         panjang_jaringan: detail.panjang_jaringan,
  //         long: detail.long,
  //         lat: detail.lat,
  //         foto: detail.foto ?? '-',
  //         keterangan: detail.keterangan ?? '',
  //         petugas_survey: detail.petugas_survey,
  //       }));
  //
  //       await SurveyDetail.createDetailsBatch(detailsData, prisma);
  //
  //       return { header, details: detailsData };
  //     });
  //
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};
