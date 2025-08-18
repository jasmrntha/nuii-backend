import path from 'node:path';

import { SurveyStatus } from '@prisma/client';
import ExcelJS from 'exceljs';
import { StatusCodes } from 'http-status-codes';

import prisma from '../config/prisma';
import { CustomError } from '../middleware';
import { type UploadExcelRequest } from '../models';
import {
  PoleRepository,
  KonstruksiMaterial,
  Material,
  ExcelArchive,
  SurveyHeader,
} from '../repositories';

function formatWorksheetRow(
  worksheet: ExcelJS.Worksheet,
  rowIndex: number,
  border?: Partial<ExcelJS.Borders>,
) {
  const row = worksheet.getRow(rowIndex);

  // Ensure the row has at least one value to be recognized
  for (let col = 2; col <= 17; col++) {
    // Skipping column 1 (A)
    if (!row.getCell(col).value) {
      row.getCell(col).value = '-';
    } // Set a placeholder value
  }

  if (!border) {
    border = {
      top: { style: 'dotted' },
      left: { style: 'thin' },
      bottom: { style: 'dotted' },
      right: { style: 'thin' },
    };
  }

  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber > 1 && colNumber < 18) {
      // Skip column A
      cell.border = border;

      if (cell.value == '-') {
        cell.value = '';
      }
    }
  });
}

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

interface IMaterialPrice {
  material: any;
  total_kuantitas: number;
  total_berat: number;
  total_harga_material: number;
  total_pasang: number;
  total_bongkar: number;
}

interface IKonstruksiPrice {
  id: number;
  nama_konstruksi: string;
  materials: IMaterialPrice[];
}

interface ITiangPrice extends IMaterialPrice {}

interface IPolePrice {
  id: number;
  nama_pole: string;
  materials: IMaterialPrice[];
}

interface IGroundingPrice {
  id: number;
  nama_grounding: string;
  idKonstruksi: number;
  materials: IMaterialPrice[];
}

interface IKonduktorPrice {
  data_konduktor: any;
  total_kuantitas: number;
  total_berat: number;
  total_harga_material: number;
  total_pasang: number;
  total_bongkar: number;
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

      let totalAkhirBerat = 0;

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

      // Step 3: Get all materials required and the amount for each unique konstruksi and tiang

      // Step 4: Calculate the total price of each material for each unique konstruksi

      const workbook = new ExcelJS.Workbook();
      const rekap = workbook.addWorksheet('REKAP');
      const cubicle = isCubicle ? workbook.addWorksheet('CUBICLE') : null;
      const sutm = isSutm ? workbook.addWorksheet('SUTM') : null;
      const sktm = isSktm ? workbook.addWorksheet('SKTM') : null;
      const appTm = isCubicle ? workbook.addWorksheet('APP TM') : null;

      const rowTipePekerjaan = [];
      const rowTitle = [];
      const rowPoleSupport = [];
      const rowKonstruksi = [];
      const rowGrounding = [];

      // Set column widths
      if (sutm) {
        sutm.columns = [
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
        sutm.mergeCells('C2:D2');
        sutm.getCell('C2').value = 'PT PLN (PERSERO)';

        sutm.mergeCells('C3:D3');
        sutm.getCell('C3').value = 'DISTRIBUSI JAWA TIMUR';

        sutm.mergeCells('C4:D4');
        sutm.getCell('C4').value = 'UP3 SURABAYA BARAT';

        const imagePath = path.resolve(process.cwd(), 'storage/file/image.png');

        // 📌 Read Image File (Ensure the path is correct)
        const imageId = workbook.addImage({
          filename: imagePath, // Replace with your image path
          extension: 'png',
        });

        // 📌 Merge Cells in Column B (B2 to B4)
        sutm.mergeCells('B2:B4');

        // 📌 Ensure Column B Has a Defined Width
        const column = sutm.getColumn(2);
        if (!column.width) column.width = 10; // Set a default width if not defined

        // 📌 Get Column Width in Pixels (Each unit ≈ 7.5 pixels)
        const columnWidthPx = column.width * 7.5;

        // 📌 Define Image Width in Pixels
        const imageWidthPx = 44.6;

        // 📌 Calculate Horizontal Offset (Centering)
        const offsetX = (columnWidthPx - imageWidthPx) / 2;

        // 📌 Position Image in the sutm
        sutm.addImage(imageId, {
          tl: {
            col: 1, // Column B (zero-based index)
            row: 1, // Row 2 (zero-based index)
            nativeCol: 1,
            nativeColOff: offsetX * 9525, // Convert pixels to Excel EMUs
            nativeRow: 1,
            nativeRowOff: 0, // Already centered vertically
          },
          ext: { width: 44.6, height: 61.63 }, // Set image size in pixels
        });

        // Merge for Title
        sutm.mergeCells('B6:Q6');
        sutm.getCell('B6').value = 'RENCANA ANGGARAN BIAYA ESTETIKA';
        sutm.getCell('B6').alignment = { horizontal: 'center' };

        // Merging cells and filling job description details
        sutm.mergeCells('E8:G8');
        sutm.getCell('E8').value = 'URAIAN PEKERJAAN';
        sutm.getCell('H8').value = ':';
        sutm.getCell('H8').alignment = { horizontal: 'center' };
        sutm.getCell('I8').value = `${survey.nama_survey}`;

        sutm.mergeCells('E9:G9');
        sutm.getCell('E9').value = 'JENIS';
        sutm.getCell('H9').value = ':';
        sutm.getCell('H9').alignment = { horizontal: 'center' };
        sutm.getCell('I9').value = `${survey.nama_pekerjaan}`;

        sutm.mergeCells('E10:G10');
        sutm.getCell('E10').value = 'LOKASI';
        sutm.getCell('H10').value = ':';
        sutm.getCell('H10').alignment = { horizontal: 'center' };
        sutm.getCell('I10').value = '-';

        sutm.getCell('H11').value = ':';
        sutm.getCell('H11').alignment = { horizontal: 'center' };
        sutm.getCell('I11').value = `${survey.lokasi}`;

        sutm.mergeCells('E12:G12');
        sutm.getCell('E12').value = 'VOLUME';
        sutm.getCell('H12').value = ':';
        sutm.getCell('H12').alignment = { horizontal: 'center' };
        sutm.getCell('I12').value = `${konduktorPrices[0].total_kuantitas}`;
        sutm.getCell('I12').alignment = { horizontal: 'center' };
        sutm.getCell('J12').value = 'MS';
        sutm.getCell('J12').alignment = { horizontal: 'center' };

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

        sutm.getRow(15).values = headers;
        sutm.getRow(16).values = [
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

        sutm.mergeCells('B15:B16');
        sutm.mergeCells('C15:C16');
        sutm.mergeCells('D15:D16');
        sutm.mergeCells('E15:E16');
        sutm.mergeCells('F15:F16');
        sutm.mergeCells('G15:G16');
        sutm.mergeCells('H15:J15');
        sutm.mergeCells('K15:M15');
        sutm.mergeCells('N15:P15');
        sutm.mergeCells('Q15:Q16');

        sutm.getRow(15).height = 30;
        sutm.getRow(16).height = 40;

        // Formatting header row
        for (const rowNumber of [15, 16]) {
          const row = sutm.getRow(rowNumber);
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

        formatWorksheetRow(sutm, 17);

        let previousRow = 17;

        previousRow += 1;
        sutm.getCell(`C${previousRow}`).value = '   TIANG BETON';
        formatWorksheetRow(sutm, previousRow);

        rowTitle.push(previousRow);

        let totalTiang = 0;

        for (const tiang of tiangPrices) {
          previousRow += 1;
          sutm.getCell(`B${previousRow}`).value = tiang.material.nomor_material;
          sutm.getCell(`C${previousRow}`).value = tiang.material.nama_material;
          sutm.getCell(`D${previousRow}`).value = tiang.material.jenis_material;
          sutm.getCell(`D${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`E${previousRow}`).value = Number(
            tiang.material.berat_material,
          );
          sutm.getCell(`E${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`F${previousRow}`).value =
            tiang.material.satuan_material;
          sutm.getCell(`F${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`G${previousRow}`).value = tiang.total_berat;

          totalAkhirBerat += tiang.total_berat;

          sutm.getCell(`G${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`H${previousRow}`).value = tiang.total_kuantitas;
          sutm.getCell(`H${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`I${previousRow}`).value = tiang.total_kuantitas;
          totalTiang += tiang.total_kuantitas;
          sutm.getCell(`I${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`J${previousRow}`).value = {
            formula: '0',
            result: 0,
          };
          sutm.getCell(`J${previousRow}`).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          sutm.getCell(`K${previousRow}`).value = tiang.material.harga_material;
          sutm.getCell(`L${previousRow}`).value = tiang.material.pasang_rab;
          sutm.getCell(`N${previousRow}`).value = tiang.total_harga_material;
          sutm.getCell(`O${previousRow}`).value = tiang.total_pasang;
          sutm.getCell(`Q${previousRow}`).value =
            tiang.total_harga_material + tiang.total_pasang;

          formatWorksheetRow(sutm, previousRow);
        }

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        if (polePrices.length > 0) {
          previousRow += 1;
          sutm.getCell(`C${previousRow}`).value = '   POLE SUPPORTER :';

          formatWorksheetRow(sutm, previousRow);

          rowTitle.push(previousRow);

          for (const poles of polePrices) {
            const pole = await PoleRepository.getPoleById(poles.id);
            previousRow += 1;
            sutm.getCell(`C${previousRow}`).value =
              `   ${pole.nama_pole.toUpperCase()}`;
            formatWorksheetRow(sutm, previousRow);

            rowPoleSupport.push(previousRow);

            const groupedMaterials: Record<string, typeof poles.materials> = {};

            for (const item of poles.materials) {
              const tipePekerjaan =
                item.material.tipe_pekerjaan?.tipe_pekerjaan || '';

              if (!groupedMaterials[tipePekerjaan]) {
                groupedMaterials[tipePekerjaan] = [];
              }

              groupedMaterials[tipePekerjaan].push(item);
            }

            for (const [groupKey, group] of Object.entries(groupedMaterials)) {
              if (groupKey != '') {
                previousRow += 1;
                sutm.getCell(`C${previousRow}`).value = `   ${groupKey} :`;
                formatWorksheetRow(sutm, previousRow);

                rowTipePekerjaan.push(previousRow);
              }

              // Process each material in the group
              for (const calculatedPole of group) {
                previousRow += 1;

                totalAkhirBerat += calculatedPole.total_berat;

                const rowData = [
                  {
                    col: 'B',
                    value: calculatedPole.material.nomor_material,
                  },
                  { col: 'C', value: calculatedPole.material.nama_material },
                  {
                    col: 'D',
                    value: calculatedPole.material.jenis_material,
                    isAlign: true,
                  },
                  {
                    col: 'E',
                    value: Number(calculatedPole.material.berat_material),
                    isAlign: true,
                  },
                  {
                    col: 'F',
                    value: calculatedPole.material.satuan_material,
                    isAlign: true,
                  },
                  {
                    col: 'G',
                    value: calculatedPole.total_berat,
                    isAlign: true,
                  },
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
                  {
                    col: 'J',
                    value: { formula: '0', result: 0 },
                    isAlign: true,
                  },
                  {
                    col: 'K',
                    value: calculatedPole.material.harga_material,
                  },
                  { col: 'L', value: calculatedPole.material.pasang_rab },
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
                  sutm.getCell(`${col}${previousRow}`).value = value;

                  if (isAlign) {
                    sutm.getCell(`${col}${previousRow}`).alignment = {
                      horizontal: 'center',
                      vertical: 'middle',
                    };
                  }
                }

                formatWorksheetRow(sutm, previousRow);
              }
            }

            previousRow += 1;
            formatWorksheetRow(sutm, previousRow);
          }

          previousRow += 1;
          formatWorksheetRow(sutm, previousRow);
        }

        previousRow += 1;
        sutm.getCell(`C${previousRow}`).value = '   POLE TOP ARRANGEMENT :';
        formatWorksheetRow(sutm, previousRow);

        rowTitle.push(previousRow);

        for (const calculatedKonstruksi of totalPrices) {
          const konstruksi = calculatedKonstruksi;

          // Find the corresponding groundingPrices entry
          const groundingPricesForKonstruksi = flattenedGroundingPrices.filter(
            g => g.idKonstruksi === calculatedKonstruksi.id,
          );

          previousRow += 1;
          sutm.getCell(`C${previousRow}`).value =
            `   ${konstruksi.nama_konstruksi.toUpperCase()}`;
          formatWorksheetRow(sutm, previousRow);

          rowKonstruksi.push(previousRow);

          const groupedMaterials: Record<
            string,
            typeof calculatedKonstruksi.materials
          > = {};

          for (const item of calculatedKonstruksi.materials) {
            const tipePekerjaan =
              item.material.tipe_pekerjaan?.tipe_pekerjaan || '';

            if (!groupedMaterials[tipePekerjaan]) {
              groupedMaterials[tipePekerjaan] = [];
            }

            groupedMaterials[tipePekerjaan].push(item);
          }

          for (const [groupKey, group] of Object.entries(groupedMaterials)) {
            if (groupKey != '') {
              previousRow += 1;
              sutm.getCell(`C${previousRow}`).value = `   ${groupKey} :`;
              formatWorksheetRow(sutm, previousRow);

              rowTipePekerjaan.push(previousRow);
            }

            // Process each material in the group
            for (const calculatedPole of group) {
              previousRow += 1;

              totalAkhirBerat += calculatedPole.total_berat;

              const rowData = [
                { col: 'B', value: calculatedPole.material.nomor_material },
                { col: 'C', value: calculatedPole.material.nama_material },
                {
                  col: 'D',
                  value: calculatedPole.material.jenis_material,
                  isAlign: true,
                },
                {
                  col: 'E',
                  value: Number(calculatedPole.material.berat_material),
                  isAlign: true,
                },
                {
                  col: 'F',
                  value: calculatedPole.material.satuan_material,
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
                { col: 'K', value: calculatedPole.material.harga_material },
                { col: 'L', value: calculatedPole.material.pasang_rab },
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
                sutm.getCell(`${col}${previousRow}`).value = value;

                if (isAlign) {
                  sutm.getCell(`${col}${previousRow}`).alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                  };
                }
              }

              formatWorksheetRow(sutm, previousRow);
            }
          }

          previousRow += 1;
          formatWorksheetRow(sutm, previousRow);

          // Example usage of groundingPrice
          if (
            groundingPricesForKonstruksi &&
            groundingPricesForKonstruksi.length > 0
          ) {
            // You can use groundingPrice here however you need
            for (const groundingPrice of groundingPricesForKonstruksi) {
              const grounding = groundingPrice;

              previousRow += 1;
              sutm.getCell(`C${previousRow}`).value =
                `   ${grounding.nama_grounding.toUpperCase()}`;
              formatWorksheetRow(sutm, previousRow);

              rowGrounding.push(previousRow);

              const groupedMaterials: Record<
                string,
                typeof groundingPrice.materials
              > = {};

              for (const item of groundingPrice.materials) {
                const tipePekerjaan =
                  item.material.tipe_pekerjaan?.tipe_pekerjaan || '';

                if (!groupedMaterials[tipePekerjaan]) {
                  groupedMaterials[tipePekerjaan] = [];
                }

                groupedMaterials[tipePekerjaan].push(item);
              }

              for (const [groupKey, group] of Object.entries(
                groupedMaterials,
              )) {
                if (groupKey != '') {
                  previousRow += 1;
                  sutm.getCell(`C${previousRow}`).value = `   ${groupKey} :`;
                  formatWorksheetRow(sutm, previousRow);
                }

                // Process each material in the group
                for (const calculatedGrounding of group) {
                  previousRow += 1;

                  totalAkhirBerat += calculatedGrounding.total_berat;

                  const rowData = [
                    {
                      col: 'B',
                      value: calculatedGrounding.material.nomor_material,
                    },
                    {
                      col: 'C',
                      value: calculatedGrounding.material.nama_material,
                    },
                    {
                      col: 'D',
                      value: calculatedGrounding.material.jenis_material,
                      isAlign: true,
                    },
                    {
                      col: 'E',
                      value: Number(
                        calculatedGrounding.material.berat_material,
                      ),
                      isAlign: true,
                    },
                    {
                      col: 'F',
                      value: calculatedGrounding.material.satuan_material,
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
                      value: calculatedGrounding.material.harga_material,
                    },
                    {
                      col: 'L',
                      value: calculatedGrounding.material.pasang_rab,
                    },
                    {
                      col: 'N',
                      value: calculatedGrounding.total_harga_material,
                    },
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
                    sutm.getCell(`${col}${previousRow}`).value = value;

                    if (isAlign) {
                      sutm.getCell(`${col}${previousRow}`).alignment = {
                        horizontal: 'center',
                        vertical: 'middle',
                      };
                    }
                  }

                  formatWorksheetRow(sutm, previousRow);
                }
              }
            }
          }

          previousRow += 1;
          formatWorksheetRow(sutm, previousRow);
        }

        previousRow += 1;
        sutm.getCell(`C${previousRow}`).value =
          '   ANTI CLIMBING + DANGER PLATE :';
        formatWorksheetRow(sutm, previousRow);

        rowTitle.push(previousRow);

        const antiClimbing =
          await KonstruksiMaterial.findMaterialForKonstruksiById(38);

        for (const material of antiClimbing) {
          const data = await Material.findMaterialById(material.id_material);
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
              value:
                data.pasang_rab * (Number(material.kuantitas) * totalTiang),
            },
            {
              col: 'Q',
              value:
                data.harga_material *
                  (Number(material.kuantitas) * totalTiang) +
                data.pasang_rab * (Number(material.kuantitas) * totalTiang),
            },
          ];

          // Apply values and alignments
          for (const { col, value, isAlign } of rowData) {
            sutm.getCell(`${col}${previousRow}`).value = value;

            if (isAlign) {
              sutm.getCell(`${col}${previousRow}`).alignment = {
                horizontal: 'center',
                vertical: 'middle',
              };
            }
          }

          formatWorksheetRow(sutm, previousRow);
        }

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        sutm.getCell(`C${previousRow}`).value = '   CONDUCTOR ACCESSORIES :';
        formatWorksheetRow(sutm, previousRow);

        rowTitle.push(previousRow);

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
          sutm.getCell(`${col}${previousRow}`).value = value;

          if (isAlign) {
            sutm.getCell(`${col}${previousRow}`).alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
          }
        }

        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        sutm.getCell(`C${previousRow}`).value = '   PEKERJAAN PENDUKUNG :';
        formatWorksheetRow(sutm, previousRow);

        rowTitle.push(previousRow);

        const pekerjaanPendukung = [];

        pekerjaanPendukung.push(
          await Material.findMaterialById(541),
          await Material.findMaterialById(536),
          await Material.findMaterialById(534),
        );

        let rowAngkutan;

        for (const material of pekerjaanPendukung) {
          previousRow += 1;

          let value = 1;

          if (material.nomor_material === 534) {
            rowAngkutan = previousRow;
            value = Math.ceil(totalAkhirBerat * 100) / 100;
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
              value: { formula: '0', result: 0 },
              isAlign: true,
            },
            {
              col: 'F',
              value: material.satuan_material,
              isAlign: true,
            },
            {
              col: 'G',
              value: material.nomor_material === 534 ? totalAkhirBerat : 0,
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
              value: Math.ceil(material.pasang_rab * value),
            },
            {
              col: 'Q',
              value: Math.ceil(material.pasang_rab * value),
            },
          ];

          // Apply values and alignments
          for (const { col, value, isAlign } of rowData) {
            sutm.getCell(`${col}${previousRow}`).value = value;

            if (isAlign) {
              sutm.getCell(`${col}${previousRow}`).alignment = {
                horizontal: 'center',
                vertical: 'middle',
              };
            }
          }

          formatWorksheetRow(sutm, previousRow);
        }

        const lastRow = previousRow;

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        const totalMaterial = previousRow;
        sutm.getCell(`C${previousRow}`).value = '   Jumlah Harga Material';
        sutm.getCell(`N${previousRow}`).value = {
          formula: `SUM(N17:N${lastRow})`,
        };
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        const totalJasa = previousRow;
        sutm.getCell(`C${previousRow}`).value = '   Jumlah Harga Jasa';
        sutm.getCell(`O${previousRow}`).value = {
          formula: `SUM(O17:O${lastRow})`,
        };
        sutm.getCell(`P${previousRow}`).value = {
          formula: `SUM(P17:P${lastRow})`,
        };
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        const jumlahHarga = previousRow;
        sutm.getCell(`C${previousRow}`).value = '   Jumlah Harga';
        sutm.getCell(`Q${previousRow}`).value = {
          formula: `N${totalMaterial} + O${totalJasa} + P${totalJasa}`,
        };
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        sutm.getCell(`C${previousRow}`).value = '   Perkiraan Kerja Tambah';
        formatWorksheetRow(sutm, previousRow);

        previousRow += 1;
        const totalRow = previousRow;
        sutm.getCell(`C${previousRow}`).value = '   T O T A L';
        sutm.getCell(`Q${previousRow}`).value = {
          formula: `Q${jumlahHarga}`,
        };
        formatWorksheetRow(sutm, previousRow, {
          top: { style: 'dotted' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        });

        previousRow += 1;
        previousRow += 1;
        const date = new Date();
        const months = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember',
        ];

        sutm.mergeCells(`O${previousRow}:Q${previousRow}`);
        sutm.getCell(`O${previousRow}`).value = `Sidoarjo, ${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`;
        sutm.getCell(`O${previousRow}`).alignment = { horizontal: 'center' };

        previousRow += 1;
        const ttd = [];
        ttd.push(previousRow);
        sutm.mergeCells(`O${previousRow}:Q${previousRow}`);
        sutm.getCell(`O${previousRow}`).value = `ASMAN PERENCANAAN`;
        sutm.getCell(`O${previousRow}`).alignment = { horizontal: 'center' };

        previousRow += 4;

        sutm.mergeCells(`O${ttd[0] + 1}:Q${previousRow - 1}`);

        ttd.push(previousRow);
        sutm.mergeCells(`O${previousRow}:Q${previousRow}`);
        sutm.getCell(`O${previousRow}`).value = `M SYAIFUDIN`;
        sutm.getCell(`O${previousRow}`).alignment = { horizontal: 'center' };

        sutm.eachRow(row => {
          row.eachCell(cell => {
            cell.font = {
              name: 'Arial',
              size: 12,
            };
          });
        });

        for (let rowIndex = 17; rowIndex <= lastRow; rowIndex++) {
          sutm.getCell(`B${rowIndex}`).font = {
            name: 'Arial',
            size: 12,
            color: { argb: 'FF0000' },
          };
        }

        for (const row of rowTipePekerjaan) {
          sutm.getCell(`C${row}`).font = {
            name: 'Arial',
            size: 12,
            color: { argb: 'FF0000' },
          };
        }

        for (const row of ttd) {
          sutm.getCell(`Os${row}`).font = {
            name: 'Arial',
            size: 12,
            bold: true,
          };
        }

        for (const row of rowTitle) {
          sutm.getCell(`C${row}`).font = {
            name: 'Arial',
            size: 12,
            bold: true,
          };

          sutm.getCell(`C${row}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FDE9D9' },
          };
        }

        for (const row of rowPoleSupport) {
          sutm.getCell(`C${row}`).font = {
            name: 'Arial',
            size: 12,
            bold: true,
          };

          sutm.getCell(`C${row}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' },
          };
        }

        for (const row of rowKonstruksi) {
          sutm.getCell(`C${row}`).font = {
            name: 'Arial',
            size: 12,
            bold: true,
          };

          sutm.getCell(`C${row}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EBF1DE' },
          };
        }

        for (const row of rowGrounding) {
          sutm.getCell(`C${row}`).font = {
            name: 'Arial',
            size: 12,
            bold: true,
            color: { argb: 'C00000' },
          };

          sutm.getCell(`C${row}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FDE9D9' },
          };
        }

        for (let rowIndex = 17; rowIndex <= lastRow; rowIndex++) {
          for (let colIndex = 11; colIndex <= 17; colIndex++) {
            // Columns K to Q
            sutm.getCell(rowIndex, colIndex).font = {
              name: 'Arial',
              size: 12,
              color: { argb: '00B0F0' },
            };

            sutm.getCell(rowIndex, colIndex).numFmt = '#,##0';
          }
        }

        for (let rowIndex = 17; rowIndex <= lastRow; rowIndex++) {
          sutm.getCell(`G${rowIndex}`).numFmt = '0.00';
        }

        sutm.getCell(`I${rowAngkutan}`).numFmt = '0.00';

        for (let rowIndex = totalMaterial; rowIndex <= totalRow; rowIndex++) {
          sutm.getCell(`C${rowIndex}`).font = {
            name: 'Arial',
            size: 12,
            bold: true,
            color: { argb: '002060' },
          };
        }

        for (let rowIndex = totalMaterial; rowIndex <= totalRow; rowIndex++) {
          for (let colIndex = 11; colIndex <= 17; colIndex++) {
            sutm.getCell(rowIndex, colIndex).numFmt = '#,##0';
          }
        }

        for (let colIndex = 2; colIndex <= 17; colIndex++) {
          sutm.getCell(15, colIndex).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DAEEF3' },
          };
          sutm.getCell(16, colIndex).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DAEEF3' },
          };
        }

        sutm.getCell('D15').font = { name: 'Arial', size: 12, bold: true };
        sutm.getCell('B6').font = {
          name: 'Arial',
          size: 12,
          bold: true,
          underline: true,
        };
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
