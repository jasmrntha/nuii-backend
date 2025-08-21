import path from 'node:path';

import type ExcelJS from 'exceljs';

import { KonstruksiMaterial, Material } from '../repositories';

export function formatWorksheetRow(
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

export interface IMaterialPrice {
  material: any;
  total_kuantitas: number;
  total_berat: number;
  total_harga_material: number;
  total_pasang: number;
  total_bongkar: number;
}

export interface IKonstruksiPrice {
  id: number;
  nama_konstruksi: string;
  materials: IMaterialPrice[];
}

export interface ITiangPrice extends IMaterialPrice {}

export interface IPolePrice {
  id: number;
  nama_pole: string;
  materials: IMaterialPrice[];
}

export interface IGroundingPrice {
  id: number;
  nama_grounding: string;
  idKonstruksi: number;
  materials: IMaterialPrice[];
}

export interface IKonduktorPrice {
  data_konduktor: any;
  total_kuantitas: number;
  total_berat: number;
  total_harga_material: number;
  total_pasang: number;
  total_bongkar: number;
}

export interface ICubiclePrice {
  id: number;
  nama_cubicle: string;
  materials: IMaterialPrice[];
}

export async function writeSutmSheet(
  sutm: ExcelJS.Worksheet,
  survey: any,
  tiangPrices: ITiangPrice[],
  polePrices: IPolePrice[],
  totalPrices: IKonstruksiPrice[],
  flattenedGroundingPrices: IGroundingPrice[],
  konduktorPrices: IKonduktorPrice[],
  workbook: ExcelJS.Workbook,
) {
  let totalAkhirBerat = 0;
  const rowTipePekerjaan = [];
  const rowTitle = [];
  const rowPoleSupport = [];
  const rowKonstruksi = [];
  const rowGrounding = [];

  // Set column widths
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
    sutm.getCell(`F${previousRow}`).value = tiang.material.satuan_material;
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
      previousRow += 1;
      sutm.getCell(`C${previousRow}`).value =
        `   ${poles.nama_pole.toUpperCase()}`;
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
      const tipePekerjaan = item.material.tipe_pekerjaan?.tipe_pekerjaan || '';

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
              calculatedPole.total_harga_material + calculatedPole.total_pasang,
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

        for (const [groupKey, group] of Object.entries(groupedMaterials)) {
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
                value: Number(calculatedGrounding.material.berat_material),
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
  sutm.getCell(`C${previousRow}`).value = '   ANTI CLIMBING + DANGER PLATE :';
  formatWorksheetRow(sutm, previousRow);

  rowTitle.push(previousRow);

  const antiClimbing = await KonstruksiMaterial.findMaterialForKonstruksiById(
    38,
    true,
  );

  for (const material of antiClimbing) {
    const data = material.material;
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
        value: data.harga_material * (Number(material.kuantitas) * totalTiang),
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

  return totalAkhirBerat;
}

export function writeCubicleSheet(
  cubicle: ExcelJS.Worksheet,
  survey: any,
  cubiclePrices: ICubiclePrice[],
  workbook: ExcelJS.Workbook,
) {
  let totalAkhirBerat = 0;
  cubicle.columns = [
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
  cubicle.mergeCells('C2:D2');
  cubicle.getCell('C2').value = 'PT PLN (PERSERO)';

  cubicle.mergeCells('C3:D3');
  cubicle.getCell('C3').value = 'DISTRIBUSI JAWA TIMUR';

  cubicle.mergeCells('C4:D4');
  cubicle.getCell('C4').value = 'UP3 SURABAYA BARAT';

  const imagePath = path.resolve(process.cwd(), 'storage/file/image.png');

  // 📌 Read Image File (Ensure the path is correct)
  const imageId = workbook.addImage({
    filename: imagePath, // Replace with your image path
    extension: 'png',
  });

  // 📌 Merge Cells in Column B (B2 to B4)
  cubicle.mergeCells('B2:B4');

  // 📌 Ensure Column B Has a Defined Width
  const column = cubicle.getColumn(2);
  if (!column.width) column.width = 10; // Set a default width if not defined

  // 📌 Get Column Width in Pixels (Each unit ≈ 7.5 pixels)
  const columnWidthPx = column.width * 7.5;

  // 📌 Define Image Width in Pixels
  const imageWidthPx = 44.6;

  // 📌 Calculate Horizontal Offset (Centering)
  const offsetX = (columnWidthPx - imageWidthPx) / 2;

  // 📌 Position Image in the cubicle
  cubicle.addImage(imageId, {
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
  cubicle.mergeCells('B6:Q6');
  cubicle.getCell('B6').value = 'RENCANA ANGGARAN BIAYA ESTETIKA';
  cubicle.getCell('B6').alignment = { horizontal: 'center' };

  // Merging cells and filling job description details
  cubicle.mergeCells('E8:G8');
  cubicle.getCell('E8').value = 'URAIAN PEKERJAAN';
  cubicle.getCell('H8').value = ':';
  cubicle.getCell('H8').alignment = { horizontal: 'center' };
  cubicle.getCell('I8').value = `${survey.nama_survey}`;

  cubicle.mergeCells('E9:G9');
  cubicle.getCell('E9').value = 'JENIS';
  cubicle.getCell('H9').value = ':';
  cubicle.getCell('H9').alignment = { horizontal: 'center' };
  cubicle.getCell('I9').value = `${survey.nama_pekerjaan}`;

  cubicle.mergeCells('E10:G10');
  cubicle.getCell('E10').value = 'LOKASI';
  cubicle.getCell('H10').value = ':';
  cubicle.getCell('H10').alignment = { horizontal: 'center' };
  cubicle.getCell('I10').value = '-';

  cubicle.getCell('H11').value = ':';
  cubicle.getCell('H11').alignment = { horizontal: 'center' };
  cubicle.getCell('I11').value = `${survey.lokasi}`;

  cubicle.mergeCells('E12:G12');
  cubicle.getCell('E12').value = 'VOLUME';
  cubicle.getCell('H12').value = ':';
  cubicle.getCell('H12').alignment = { horizontal: 'center' };
  cubicle.getCell('I12').value = '-';
  cubicle.getCell('I12').alignment = { horizontal: 'center' };
  cubicle.getCell('J12').value = 'MS';
  cubicle.getCell('J12').alignment = { horizontal: 'center' };

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

  cubicle.getRow(15).values = headers;
  cubicle.getRow(16).values = [
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

  cubicle.mergeCells('B15:B16');
  cubicle.mergeCells('C15:C16');
  cubicle.mergeCells('D15:D16');
  cubicle.mergeCells('E15:E16');
  cubicle.mergeCells('F15:F16');
  cubicle.mergeCells('G15:G16');
  cubicle.mergeCells('H15:J15');
  cubicle.mergeCells('K15:M15');
  cubicle.mergeCells('N15:P15');
  cubicle.mergeCells('Q15:Q16');

  cubicle.getRow(15).height = 30;
  cubicle.getRow(16).height = 40;

  // Formatting header row
  for (const rowNumber of [15, 16]) {
    const row = cubicle.getRow(rowNumber);
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

  formatWorksheetRow(cubicle, 17);

  let previousRow = 17;

  for (const price of cubiclePrices) {
    previousRow += 1;
    cubicle.getCell(`C${previousRow}`).value = price.nama_material;
    formatWorksheetRow(cubicle, previousRow);

    for (const material of price.materials) {
      previousRow += 1;
      cubicle.getCell(`B${previousRow}`).value =
        material.material.nomor_material;
      cubicle.getCell(`C${previousRow}`).value =
        material.material.nama_material;
      cubicle.getCell(`D${previousRow}`).value =
        material.material.jenis_material;
      cubicle.getCell(`D${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`E${previousRow}`).value = Number(
        material.material.berat_material,
      );
      cubicle.getCell(`E${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`F${previousRow}`).value =
        material.material.satuan_material;
      cubicle.getCell(`F${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`G${previousRow}`).value = material.total_berat;
      totalAkhirBerat += material.total_berat;
      cubicle.getCell(`G${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`H${previousRow}`).value = material.total_kuantitas;
      cubicle.getCell(`H${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`I${previousRow}`).value = material.total_kuantitas;
      cubicle.getCell(`I${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`J${previousRow}`).value = {
        formula: '0',
        result: 0,
      };
      cubicle.getCell(`J${previousRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cubicle.getCell(`K${previousRow}`).value =
        material.material.harga_material;
      cubicle.getCell(`L${previousRow}`).value = material.material.pasang_rab;
      cubicle.getCell(`N${previousRow}`).value = material.total_harga_material;
      cubicle.getCell(`O${previousRow}`).value = material.total_pasang;
      cubicle.getCell(`Q${previousRow}`).value =
        material.total_harga_material + material.total_pasang;

      formatWorksheetRow(cubicle, previousRow);
    }
  }

  const lastRow = previousRow;

  previousRow += 1;
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  const totalMaterial = previousRow;
  cubicle.getCell(`C${previousRow}`).value = '   Jumlah Harga Material';
  cubicle.getCell(`N${previousRow}`).value = {
    formula: `SUM(N17:N${lastRow})`,
  };
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  const totalJasa = previousRow;
  cubicle.getCell(`C${previousRow}`).value = '   Jumlah Harga Jasa';
  cubicle.getCell(`O${previousRow}`).value = {
    formula: `SUM(O17:O${lastRow})`,
  };
  cubicle.getCell(`P${previousRow}`).value = {
    formula: `SUM(P17:P${lastRow})`,
  };
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  const jumlahHarga = previousRow;
  cubicle.getCell(`C${previousRow}`).value = '   Jumlah Harga';
  cubicle.getCell(`Q${previousRow}`).value = {
    formula: `N${totalMaterial} + O${totalJasa} + P${totalJasa}`,
  };
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  cubicle.getCell(`C${previousRow}`).value = '   Perkiraan Kerja Tambah';
  formatWorksheetRow(cubicle, previousRow);

  previousRow += 1;
  const totalRow = previousRow;
  cubicle.getCell(`C${previousRow}`).value = '   T O T A L';
  cubicle.getCell(`Q${previousRow}`).value = {
    formula: `Q${jumlahHarga}`,
  };
  formatWorksheetRow(cubicle, previousRow, {
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

  cubicle.mergeCells(`O${previousRow}:Q${previousRow}`);
  cubicle.getCell(`O${previousRow}`).value = `Sidoarjo, ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
  cubicle.getCell(`O${previousRow}`).alignment = { horizontal: 'center' };

  previousRow += 1;
  const ttd = [];
  ttd.push(previousRow);
  cubicle.mergeCells(`O${previousRow}:Q${previousRow}`);
  cubicle.getCell(`O${previousRow}`).value = `ASMAN PERENCANAAN`;
  cubicle.getCell(`O${previousRow}`).alignment = { horizontal: 'center' };

  previousRow += 4;

  cubicle.mergeCells(`O${ttd[0] + 1}:Q${previousRow - 1}`);

  ttd.push(previousRow);
  cubicle.mergeCells(`O${previousRow}:Q${previousRow}`);
  cubicle.getCell(`O${previousRow}`).value = `M SYAIFUDIN`;
  cubicle.getCell(`O${previousRow}`).alignment = { horizontal: 'center' };

  cubicle.eachRow(row => {
    row.eachCell(cell => {
      cell.font = {
        name: 'Arial',
        size: 12,
      };
    });
  });

  for (let rowIndex = 17; rowIndex <= lastRow; rowIndex++) {
    cubicle.getCell(`B${rowIndex}`).font = {
      name: 'Arial',
      size: 12,
      color: { argb: 'FF0000' },
    };
  }

  for (const row of ttd) {
    cubicle.getCell(`Os${row}`).font = {
      name: 'Arial',
      size: 12,
      bold: true,
    };
  }

  for (let rowIndex = 17; rowIndex <= lastRow; rowIndex++) {
    for (let colIndex = 11; colIndex <= 17; colIndex++) {
      // Columns K to Q
      cubicle.getCell(rowIndex, colIndex).font = {
        name: 'Arial',
        size: 12,
        color: { argb: '00B0F0' },
      };

      cubicle.getCell(rowIndex, colIndex).numFmt = '#,##0';
    }
  }

  for (let rowIndex = 17; rowIndex <= lastRow; rowIndex++) {
    cubicle.getCell(`G${rowIndex}`).numFmt = '0.00';
  }

  for (let rowIndex = totalMaterial; rowIndex <= totalRow; rowIndex++) {
    cubicle.getCell(`C${rowIndex}`).font = {
      name: 'Arial',
      size: 12,
      bold: true,
      color: { argb: '002060' },
    };
  }

  for (let rowIndex = totalMaterial; rowIndex <= totalRow; rowIndex++) {
    for (let colIndex = 11; colIndex <= 17; colIndex++) {
      cubicle.getCell(rowIndex, colIndex).numFmt = '#,##0';
    }
  }

  for (let colIndex = 2; colIndex <= 17; colIndex++) {
    cubicle.getCell(15, colIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DAEEF3' },
    };
    cubicle.getCell(16, colIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DAEEF3' },
    };
  }

  cubicle.getCell('D15').font = { name: 'Arial', size: 12, bold: true };
  cubicle.getCell('B6').font = {
    name: 'Arial',
    size: 12,
    bold: true,
    underline: true,
  };

  return totalAkhirBerat;
}
