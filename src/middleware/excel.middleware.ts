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

export function formatSummaryHeader(worksheet: ExcelJS.Worksheet) {
  const column = ['B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K'];

  for (let row = 12; row <= 14; row++) {
    for (const col of column) {
      const cell = worksheet.getCell(`${col}${row}`);

      if (row === 12) {
        switch (col) {
          case 'B': {
            cell.border = {
              top: { style: 'double' },
              left: { style: 'double' },
              right: { style: 'thin' },
            };

            break;
          }

          case 'K': {
            cell.border = {
              top: { style: 'double' },
              left: { style: 'thin' },
              right: { style: 'double' },
            };

            break;
          }

          case 'C': {
            cell.border = {
              top: { style: 'double' },
              left: { style: 'thin' },
            };

            break;
          }

          case 'D': {
            cell.border = {
              top: { style: 'double' },
              right: { style: 'thin' },
            };

            break;
          }

          default: {
            cell.border = {
              top: { style: 'double' },
              left: { style: 'thin' },
              right: { style: 'thin' },
            };

            break;
          }
        }
      } else if (row === 13) {
        switch (col) {
          case 'C': {
            cell.border = {
              left: { style: 'thin' },
            };

            break;
          }

          case 'D': {
            cell.border = {
              right: { style: 'thin' },
            };

            break;
          }

          default: {
            cell.border = {
              left: { style: 'thin' },
              right: { style: 'thin' },
            };

            break;
          }
        }
      } else {
        switch (col) {
          case 'B': {
            cell.border = {
              left: { style: 'double' },
              bottom: { style: 'double' },
              right: { style: 'thin' },
            };

            break;
          }

          case 'K': {
            cell.border = {
              left: { style: 'thin' },
              bottom: { style: 'double' },
              right: { style: 'double' },
            };

            break;
          }

          case 'C': {
            cell.border = {
              left: { style: 'thin' },
              bottom: { style: 'double' },
            };

            break;
          }

          case 'D': {
            cell.border = {
              bottom: { style: 'double' },
              right: { style: 'thin' },
            };

            break;
          }

          default: {
            cell.border = {
              bottom: { style: 'double' },
              left: { style: 'thin' },
              right: { style: 'thin' },
            };

            break;
          }
        }
      }
      // Test
    }
  }
}

export interface IMaterialPrice {
  material: any;
  total_kuantitas: number | { formula: string };
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
  GroundingMaterial: any;
  nama_grounding: string;
  idKonstruksi: number;
  materials: IMaterialPrice[];
}

export interface IKonduktorPrice {
  data_konduktor: any;
  total_kuantitas: number | { formula: string };
  total_berat: number;
  total_harga_material: number;
  total_pasang: number;
  total_bongkar: number;
}

export interface ICubiclePrice {
  id: number;
  nama_cubicle: string;
  count: number; // how many cubicles of this type
  materials: IMaterialPrice[]; // calculated prices for all materials in this cubicle
}

export interface IAppTmPrice {
  id: number;
  nama_material: string;
  count: number; // how many cubicles of this type
  materials: IMaterialPrice[]; // calculated prices for all materials in this cubicle
}

export interface ISktmGroundingPrice {
  id: number;
  nama_grounding: string;
  count: number;
  materials: IMaterialPrice[];
}

function setupCommonHeader(
  sheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook,
  survey: any,
  title: string,
) {
  // Column widths
  sheet.columns = [
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

  // PLN header
  sheet.mergeCells('C2:D2');
  sheet.getCell('C2').value = 'PT PLN (PERSERO)';
  sheet.mergeCells('C3:D3');
  sheet.getCell('C3').value = 'DISTRIBUSI JAWA TIMUR';
  sheet.mergeCells('C4:D4');
  sheet.getCell('C4').value = 'UP3 SURABAYA BARAT';

  // Image
  const imagePath = path.resolve(process.cwd(), 'storage/file/image.png');
  const imageId = workbook.addImage({ filename: imagePath, extension: 'png' });
  sheet.mergeCells('B2:B4');
  const column = sheet.getColumn(2);
  if (!column.width) column.width = 10;
  const columnWidthPx = column.width * 7.5;
  const imageWidthPx = 44.6;
  const offsetX = (columnWidthPx - imageWidthPx) / 2;
  sheet.addImage(imageId, {
    tl: { col: 1, row: 1, nativeCol: 1, nativeColOff: offsetX * 9525 },
    ext: { width: 44.6, height: 61.63 },
  });

  // Title
  sheet.mergeCells('B6:Q6');
  sheet.getCell('B6').value = title;
  sheet.getCell('B6').alignment = { horizontal: 'center' };

  // Job description section
  sheet.mergeCells('E8:G8');
  sheet.getCell('E8').value = 'URAIAN PEKERJAAN';
  sheet.getCell('H8').value = ':';
  sheet.getCell('H8').alignment = { horizontal: 'center' };
  sheet.getCell('I8').value = `${survey.nama_survey}`;

  sheet.mergeCells('E9:G9');
  sheet.getCell('E9').value = 'JENIS';
  sheet.getCell('H9').value = ':';
  sheet.getCell('H9').alignment = { horizontal: 'center' };
  sheet.getCell('I9').value = `${survey.nama_pekerjaan}`;

  sheet.mergeCells('E10:G10');
  sheet.getCell('E10').value = 'LOKASI';
  sheet.getCell('H10').value = ':';
  sheet.getCell('H10').alignment = { horizontal: 'center' };
  sheet.getCell('I10').value = '-';
  sheet.getCell('H11').value = ':';
  sheet.getCell('H11').alignment = { horizontal: 'center' };
  sheet.getCell('I11').value = `${survey.lokasi}`;
}

function setupRekapHeader(
  sheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook,
  survey: any,
) {
  // Column widths
  sheet.columns = [
    { width: 8 },
    { width: 5 },
    { width: 55.7 },
    { width: 2 },
    { width: 0 },
    { width: 8.5 },
    { width: 13.5 },
    { width: 19.5 },
    { width: 17 },
    { width: 8 },
    { width: 23 },
    { width: 19.5 },
  ];

  // PLN header
  sheet.getCell('C1').value = 'PT PLN (PERSERO)';
  sheet.getCell('C2').value = 'DISTRIBUSI JAWA TIMUR';
  sheet.getCell('C3').value = 'UP3 SURABAYA BARAT';

  // Image
  const imagePath = path.resolve(process.cwd(), 'storage/file/image.png');
  const imageId = workbook.addImage({ filename: imagePath, extension: 'png' });
  sheet.mergeCells('B1:B3');
  const column = sheet.getColumn(2);
  if (!column.width) column.width = 10;
  const columnWidthPx = column.width * 7.5;
  const imageWidthPx = 44.6;
  const offsetX = (columnWidthPx - imageWidthPx) / 2;
  sheet.addImage(imageId, {
    tl: { col: 1, row: 1, nativeCol: 1, nativeColOff: offsetX * 9525 },
    ext: { width: 44.6, height: 61.63 },
  });

  // Title
  sheet.mergeCells('B5:K5');
  sheet.getCell('B5').value = 'REKAPITULASI RAB';
  sheet.getCell('B5').alignment = { horizontal: 'center' };

  // Job description section
  sheet.getCell('C7').value = 'JENIS / MACAM PEKERJAAN';
  sheet.getCell('D7').value = ':';
  sheet.getCell('D7').alignment = { horizontal: 'center' };

  sheet.mergeCells('F7:K7');
  sheet.getCell('F7').value = `${survey.nama_survey}`;

  sheet.getCell('C8').value = 'LOKASI PEKERJAAN';
  sheet.getCell('D8').value = ':';
  sheet.getCell('D8').alignment = { horizontal: 'center' };

  sheet.mergeCells('F8:K8');
  sheet.getCell('F8').value = `${survey.lokasi}`;
}

function setupTableHeader(sheet: ExcelJS.Worksheet) {
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

  sheet.getRow(15).values = headers;
  sheet.getRow(16).values = [
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

  sheet.mergeCells('B15:B16');
  sheet.mergeCells('C15:C16');
  sheet.mergeCells('D15:D16');
  sheet.mergeCells('E15:E16');
  sheet.mergeCells('F15:F16');
  sheet.mergeCells('G15:G16');
  sheet.mergeCells('H15:J15');
  sheet.mergeCells('K15:M15');
  sheet.mergeCells('N15:P15');
  sheet.mergeCells('Q15:Q16');

  sheet.getRow(15).height = 30;
  sheet.getRow(16).height = 40;

  for (const rowNumber of [15, 16]) {
    const row = sheet.getRow(rowNumber);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (colNumber > 1 && colNumber < 18) {
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
}

function setupSummaryHeader(sheet: ExcelJS.Worksheet) {
  const headers = [
    '',
    'No',
    'URAIAN',
    '',
    '',
    'SAT',
    'VOLUME',
    'MDU',
    'NON MDU',
    'JASA',
    'NILAI RAB',
  ];

  sheet.getRow(13).values = headers;
  sheet.getRow(14).values = ['', '', '', '', '', '', '', '', '', '', '(Rp)'];

  sheet.mergeCells('C13:C13');

  // sheet.getRow(15).height = 30;
  // sheet.getRow(16).height = 40;

  for (const rowNumber of [15, 16]) {
    const row = sheet.getRow(rowNumber);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (colNumber > 1 && colNumber < 18) {
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
}

function writeMaterialRow(
  sheet: ExcelJS.Worksheet,
  rowIndex: number,
  rowData: { col: string; value: any; isAlign?: boolean }[],
  border?: Partial<ExcelJS.Borders>,
) {
  for (const { col, value, isAlign } of rowData) {
    const cell = sheet.getCell(`${col}${rowIndex}`);
    cell.value = value;

    if (isAlign) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  }

  formatWorksheetRow(sheet, rowIndex, border);
}

// Enhanced and new helper functions
export function writeMaterialRows(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  materials: IMaterialPrice[],
  totalBeratRef: { value: number },
  options: {
    shouldIncludeFormula?: boolean;
    multiplier?: number;
  } = {},
): number {
  let currentRow = startRow;
  const { shouldIncludeFormula = true, multiplier = 1 } = options;

  for (const material of materials) {
    currentRow++;
    totalBeratRef.value += material.total_berat * multiplier;

    const rowData = [
      { col: 'B', value: material.material.nomor_material },
      { col: 'C', value: material.material.nama_material },
      { col: 'D', value: material.material.jenis_material, isAlign: true },
      {
        col: 'E',
        value: Number(material.material.berat_material) || {
          formula: '0',
          result: 0,
        },
        isAlign: true,
      },
      { col: 'F', value: material.material.satuan_material, isAlign: true },
      {
        col: 'G',
        value: material.total_berat * multiplier || { formula: '0', result: 0 },
        isAlign: true,
      },
      {
        col: 'H',
        value:
          typeof material.total_kuantitas === 'number'
            ? material.total_kuantitas * multiplier
            : material.total_kuantitas,
        isAlign: true,
      },
      {
        col: 'I',
        value:
          typeof material.total_kuantitas === 'number'
            ? material.total_kuantitas * multiplier
            : material.total_kuantitas,
        isAlign: true,
      },
      {
        col: 'J',
        value: shouldIncludeFormula ? { formula: '0', result: 0 } : 0,
        isAlign: true,
      },
      {
        col: 'K',
        value: material.material.harga_material || { formula: '0', result: 0 },
      },
      { col: 'L', value: material.material.pasang_rab },
      {
        col: 'N',
        value: material.total_harga_material * multiplier || {
          formula: '0',
          result: 0,
        },
      },
      { col: 'O', value: material.total_pasang * multiplier },
      {
        col: 'Q',
        value:
          (material.total_harga_material + material.total_pasang) * multiplier,
      },
    ];

    writeMaterialRow(sheet, currentRow, rowData);
  }

  return currentRow;
}

export function writeSectionHeader(
  sheet: ExcelJS.Worksheet,
  row: number,
  title: string,
  level: 'main' | 'sub' | 'group' = 'main',
): void {
  const prefix = '   ';
  const displayTitle = ['main', 'sub'].includes(level)
    ? title.toUpperCase()
    : `${title} :`;

  sheet.getCell(`C${row}`).value = `${prefix}${displayTitle}`;
  formatWorksheetRow(sheet, row);
}

export function writeGroupedMaterialsWithHeaders(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  materials: IMaterialPrice[],
  totalBeratRef: { value: number },
  sectionTitle: string,
  sectionType: 'sub' | 'main' | 'group' = 'main',
  trackingArrays: {
    rowTitle?: number[];
    rowSection?: number[];
    rowTipePekerjaan?: number[];
  } = {},
): number {
  let currentRow = startRow;

  // // Write main section header
  currentRow++;
  writeSectionHeader(sheet, currentRow, sectionTitle, sectionType);
  trackingArrays.rowTitle?.push(currentRow);

  // Group materials by tipe_pekerjaan
  const groupedMaterials: Record<string, IMaterialPrice[]> = {};

  for (const material of materials) {
    const tipePekerjaan =
      material.material.tipe_pekerjaan?.tipe_pekerjaan || '';

    if (!groupedMaterials[tipePekerjaan]) {
      groupedMaterials[tipePekerjaan] = [];
    }

    groupedMaterials[tipePekerjaan].push(material);
  }

  // Write grouped materials
  for (const [groupKey, group] of Object.entries(groupedMaterials)) {
    if (groupKey) {
      currentRow++;
      writeSectionHeader(sheet, currentRow, groupKey, 'group');
      trackingArrays.rowTipePekerjaan?.push(currentRow);
    }

    currentRow = writeMaterialRows(sheet, currentRow, group, totalBeratRef);
  }

  // Add spacing
  currentRow++;
  formatWorksheetRow(sheet, currentRow);

  return currentRow;
}

export function writeSummarySection(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  lastDataRow: number,
): {
  lastRow: number;
  totalRows: { material: number; jasa: number; jumlah: number; total: number };
  materialPrices: { nonMdu: number; mdu: number; jasa: number };
} {
  let row = startRow;
  const materialPrices = {
    nonMdu: 0,
    mdu: 0,
    jasa: 0,
  };

  // Empty rows
  for (let index = 0; index < 3; index++) {
    row++;
    formatWorksheetRow(sheet, row);
  }

  for (let index = 17; index < lastDataRow + 1; index++) {
    const type = sheet.getCell(`D${index}`).value;
    const price = sheet.getCell(`N${index}`).value;
    const jasa = sheet.getCell(`O${index}`).value;

    if (type == 'NON MDU') {
      materialPrices.nonMdu += Number(price.valueOf());
    } else {
      materialPrices.mdu += Number(price.valueOf());
    }

    materialPrices.jasa += Number(jasa.valueOf());
  }

  // Total Material
  row++;
  const totalMaterialRow = row;
  sheet.getCell(`C${row}`).value = '   Jumlah Harga Material';
  sheet.getCell(`N${row}`).value = { formula: `SUM(N17:N${lastDataRow})` };
  formatWorksheetRow(sheet, row);

  // Total Jasa
  row++;
  const totalJasaRow = row;
  sheet.getCell(`C${row}`).value = '   Jumlah Harga Jasa';
  sheet.getCell(`O${row}`).value = { formula: `SUM(O17:O${lastDataRow})` };
  sheet.getCell(`P${row}`).value = { formula: `SUM(P17:P${lastDataRow})` };
  formatWorksheetRow(sheet, row);

  // Jumlah Harga
  row++;
  const jumlahHargaRow = row;
  sheet.getCell(`C${row}`).value = '   Jumlah Harga';
  sheet.getCell(`Q${row}`).value = {
    formula: `N${totalMaterialRow} + O${totalJasaRow} + P${totalJasaRow}`,
  };
  formatWorksheetRow(sheet, row);

  // Perkiraan Kerja Tambah
  row++;
  sheet.getCell(`C${row}`).value = '   Perkiraan Kerja Tambah';
  formatWorksheetRow(sheet, row);

  // Total
  row++;
  const totalRow = row;
  sheet.getCell(`C${row}`).value = '   T O T A L';
  sheet.getCell(`Q${row}`).value = { formula: `Q${jumlahHargaRow}` };
  formatWorksheetRow(sheet, row, {
    top: { style: 'dotted' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  });

  return {
    lastRow: row,
    totalRows: {
      material: totalMaterialRow,
      jasa: totalJasaRow,
      jumlah: jumlahHargaRow,
      total: totalRow,
    },
    materialPrices,
  };
}

export function writeSignatureSection(
  sheet: ExcelJS.Worksheet,
  startRow: number,
): number[] {
  let row = startRow + 2;
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

  // Date
  sheet.mergeCells(`O${row}:Q${row}`);
  sheet.getCell(`O${row}`).value =
    `Sidoarjo, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  sheet.getCell(`O${row}`).alignment = { horizontal: 'center' };

  // Title
  row++;
  const ttdRows = [row];
  sheet.mergeCells(`O${row}:Q${row}`);
  sheet.getCell(`O${row}`).value = 'ASMAN PERENCANAAN';
  sheet.getCell(`O${row}`).alignment = { horizontal: 'center' };

  // Empty space for signature
  row += 4;
  sheet.mergeCells(`O${ttdRows[0] + 1}:Q${row - 1}`);

  // Name
  ttdRows.push(row);
  sheet.mergeCells(`O${row}:Q${row}`);
  sheet.getCell(`O${row}`).value = 'M SYAIFUDIN';
  sheet.getCell(`O${row}`).alignment = { horizontal: 'center' };

  return ttdRows;
}

export async function writeSupportingMaterials(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  totalWeight: number,
  materialIds: number[] = [541, 536, 534],
): Promise<{ lastRow: number; transportRow?: number }> {
  const materials =
    materialIds.length > 1
      ? await Material.findManyByIds(materialIds)
      : [await Material.findMaterialById(materialIds[0])];

  let row = startRow;
  let transportRow: number | undefined;

  for (const material of materials) {
    row++;
    let quantity = 1;

    if (material.nomor_material === 534) {
      transportRow = row;
      quantity = Math.ceil(totalWeight * 100) / 100;
    }

    const rowData = [
      { col: 'B', value: material.nomor_material },
      { col: 'C', value: material.nama_material },
      { col: 'D', value: material.jenis_material, isAlign: true },
      { col: 'E', value: { formula: '0', result: 0 }, isAlign: true },
      { col: 'F', value: material.satuan_material, isAlign: true },
      {
        col: 'G',
        value:
          material.nomor_material === 534
            ? totalWeight
            : { formula: '0', result: 0 },
        isAlign: true,
      },
      { col: 'I', value: quantity, isAlign: true },
      { col: 'L', value: material.pasang_rab },
      { col: 'O', value: Math.ceil(material.pasang_rab * quantity) },
      { col: 'Q', value: Math.ceil(material.pasang_rab * quantity) },
    ];

    writeMaterialRow(sheet, row, rowData);
  }

  return { lastRow: row, transportRow };
}

// Enhanced styling helper
interface IStyleConfig {
  rowTitle?: number[];
  rowPoleSupport?: number[];
  rowKonstruksi?: number[];
  rowGrounding?: number[];
  rowTipePekerjaan?: number[];
  ttdRows?: number[];
  lastDataRow: number;
  totalStartRow: number;
  totalEndRow: number;
  transportRow?: number;
}

export function applySheetStyling(
  sheet: ExcelJS.Worksheet,
  config: IStyleConfig,
): void {
  // Base font for all cells
  sheet.eachRow(row => {
    row.eachCell(cell => {
      cell.font = { name: 'Arial', size: 12 };
    });
  });

  // Material numbers in red
  for (let rowIndex = 17; rowIndex <= config.lastDataRow; rowIndex++) {
    sheet.getCell(`B${rowIndex}`).font = {
      name: 'Arial',
      size: 12,
      color: { argb: 'FF0000' },
    };
  }

  // Work type sections in red
  for (const row of config.rowTipePekerjaan ?? []) {
    sheet.getCell(`C${row}`).font = {
      name: 'Arial',
      size: 12,
      color: { argb: 'FF0000' },
    };
  }

  // Apply specific section styling
  const sectionStyles = [
    { rows: config.rowTitle, color: 'FDE9D9', isBold: true },
    { rows: config.rowPoleSupport, color: 'F2F2F2', isBold: true },
    { rows: config.rowKonstruksi, color: 'EBF1DE', isBold: true },
    {
      rows: config.rowGrounding,
      color: 'FDE9D9',
      isBold: true,
      textColor: 'C00000',
    },
  ];

  for (const { rows, color, isBold, textColor } of sectionStyles) {
    for (const row of rows ?? []) {
      const cell = sheet.getCell(`C${row}`);
      cell.font = {
        name: 'Arial',
        size: 12,
        bold: isBold,
        ...(textColor && { color: { argb: textColor } }),
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    }
  }

  // Price columns styling and formatting
  for (let rowIndex = 17; rowIndex <= config.lastDataRow; rowIndex++) {
    for (let colIndex = 11; colIndex <= 17; colIndex++) {
      const cell = sheet.getCell(rowIndex, colIndex);
      cell.font = { name: 'Arial', size: 12, color: { argb: '00B0F0' } };
      cell.numFmt = '#,##0';
    }

    // Weight column formatting
    sheet.getCell(`G${rowIndex}`).numFmt = '0.00';
  }

  // Special formatting for transport row
  if (config.transportRow) {
    sheet.getCell(`I${config.transportRow}`).numFmt = '0.00';
  }

  // Total section styling
  for (
    let rowIndex = config.totalStartRow;
    rowIndex <= config.totalEndRow;
    rowIndex++
  ) {
    sheet.getCell(`C${rowIndex}`).font = {
      name: 'Arial',
      size: 12,
      bold: true,
      color: { argb: '002060' },
    };

    for (let colIndex = 11; colIndex <= 17; colIndex++) {
      sheet.getCell(rowIndex, colIndex).numFmt = '#,##0';
    }
  }

  // Header styling
  for (let colIndex = 2; colIndex <= 17; colIndex++) {
    for (const rowIndex of [15, 16]) {
      sheet.getCell(rowIndex, colIndex).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DAEEF3' },
      };
    }
  }

  // Special header cells
  sheet.getCell('D15').font = { name: 'Arial', size: 12, bold: true };
  sheet.getCell('B6').font = {
    name: 'Arial',
    size: 12,
    bold: true,
    underline: true,
  };

  // Signature styling
  for (const row of config.ttdRows ?? []) {
    sheet.getCell(`O${row}`).font = { name: 'Arial', size: 12, bold: true };
  }
}

// REFACTORED writeSutmSheet function
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
  const totalAkhirBeratRef = { value: 0 };
  const trackingArrays = {
    rowTitle: [] as number[],
    rowPoleSupport: [] as number[],
    rowKonstruksi: [] as number[],
    rowGrounding: [] as number[],
    rowTipePekerjaan: [] as number[],
  };

  // Setup header and basic info
  setupCommonHeader(sutm, workbook, survey, 'RENCANA ANGGARAN BIAYA');

  sutm.mergeCells('E12:G12');
  sutm.getCell('E12').value = 'VOLUME';
  sutm.getCell('H12').value = ':';
  sutm.getCell('H12').alignment = { horizontal: 'center' };
  sutm.getCell('I12').value = `${Number(konduktorPrices[0].total_kuantitas)}`;
  sutm.getCell('I12').alignment = { horizontal: 'center' };
  sutm.getCell('J12').value = 'MS';
  sutm.getCell('J12').alignment = { horizontal: 'center' };

  setupTableHeader(sutm);
  formatWorksheetRow(sutm, 17);

  let currentRow = 17;

  // TIANG BETON section
  currentRow++;
  writeSectionHeader(sutm, currentRow, 'TIANG BETON', 'main');
  trackingArrays.rowTitle.push(currentRow);

  let totalTiang = 0;

  for (const tiang of tiangPrices) {
    totalTiang += Number(tiang.total_kuantitas);
  }

  currentRow = writeMaterialRows(
    sutm,
    currentRow,
    tiangPrices,
    totalAkhirBeratRef,
  );

  // Add spacing
  currentRow++;
  formatWorksheetRow(sutm, currentRow);
  currentRow++;
  formatWorksheetRow(sutm, currentRow);

  // POLE SUPPORTER section
  if (polePrices.length > 0) {
    currentRow++;
    writeSectionHeader(sutm, currentRow, 'POLE SUPPORTER', 'main');
    trackingArrays.rowTitle.push(currentRow);

    for (const pole of polePrices) {
      currentRow++;
      trackingArrays.rowPoleSupport.push(currentRow);

      currentRow = writeGroupedMaterialsWithHeaders(
        sutm,
        currentRow - 1,
        pole.materials,
        totalAkhirBeratRef,
        pole.nama_pole, // No title needed as we already wrote it
        'sub',
        { rowTipePekerjaan: trackingArrays.rowTipePekerjaan },
      );
    }

    currentRow++;
    formatWorksheetRow(sutm, currentRow);
  }

  // POLE TOP ARRANGEMENT section
  currentRow++;
  writeSectionHeader(sutm, currentRow, 'POLE TOP ARRANGEMENT', 'main');
  trackingArrays.rowTitle.push(currentRow);

  for (const konstruksi of totalPrices) {
    currentRow++;
    trackingArrays.rowKonstruksi.push(currentRow);

    currentRow = writeGroupedMaterialsWithHeaders(
      sutm,
      currentRow - 1,
      konstruksi.materials,
      totalAkhirBeratRef,
      konstruksi.nama_konstruksi, // No title needed
      'sub',
      { rowTipePekerjaan: trackingArrays.rowTipePekerjaan },
    );

    // Handle grounding for this konstruksi
    const groundingForKonstruksi = flattenedGroundingPrices.filter(
      g => g.idKonstruksi === konstruksi.id,
    );

    for (const grounding of groundingForKonstruksi) {
      currentRow++;
      trackingArrays.rowGrounding.push(currentRow);

      currentRow = writeGroupedMaterialsWithHeaders(
        sutm,
        currentRow - 1,
        grounding.materials,
        totalAkhirBeratRef,
        grounding.nama_grounding, // No title needed
        'sub',
        { rowTipePekerjaan: trackingArrays.rowTipePekerjaan },
      );
    }

    currentRow++;
    formatWorksheetRow(sutm, currentRow);
  }

  // ANTI CLIMBING + DANGER PLATE section
  currentRow++;
  writeSectionHeader(sutm, currentRow, 'ANTI CLIMBING + DANGER PLATE', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const antiClimbing = await KonstruksiMaterial.findMaterialForKonstruksiById(
    38,
    true,
  );
  const antiClimbingPrices: IMaterialPrice[] = antiClimbing.map(item => ({
    material: item.material,
    total_kuantitas: Number(item.kuantitas) * totalTiang,
    total_berat: (Number(item.material.berat_material) * totalTiang) / 1000,
    total_harga_material:
      item.material.harga_material * (Number(item.kuantitas) * totalTiang),
    total_pasang:
      item.material.pasang_rab * (Number(item.kuantitas) * totalTiang),
    total_bongkar: 0,
  }));

  currentRow = writeMaterialRows(
    sutm,
    currentRow,
    antiClimbingPrices,
    totalAkhirBeratRef,
  );

  currentRow++;
  formatWorksheetRow(sutm, currentRow);

  // CONDUCTOR ACCESSORIES section
  currentRow++;
  writeSectionHeader(sutm, currentRow, 'CONDUCTOR ACCESSORIES', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const konduktorAsPrices: IMaterialPrice[] = [
    {
      material: konduktorPrices[0].data_konduktor,
      total_kuantitas: konduktorPrices[0].total_kuantitas,
      total_berat: konduktorPrices[0].total_berat,
      total_harga_material: konduktorPrices[0].total_harga_material,
      total_pasang: konduktorPrices[0].total_pasang,
      total_bongkar: konduktorPrices[0].total_bongkar,
    },
  ];

  currentRow = writeMaterialRows(
    sutm,
    currentRow,
    konduktorAsPrices,
    totalAkhirBeratRef,
  );

  currentRow++;
  formatWorksheetRow(sutm, currentRow);
  currentRow++;
  formatWorksheetRow(sutm, currentRow);

  // PEKERJAAN PENDUKUNG section
  currentRow++;
  writeSectionHeader(sutm, currentRow, 'PEKERJAAN PENDUKUNG', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const { lastRow: supportingLastRow, transportRow } =
    await writeSupportingMaterials(
      sutm,
      currentRow,
      totalAkhirBeratRef.value,
      [541, 536, 534],
    );
  currentRow = supportingLastRow;

  // Summary section
  const summaryResult = writeSummarySection(sutm, currentRow, currentRow);

  // Signature section
  const ttdRows = writeSignatureSection(sutm, summaryResult.lastRow);

  // Apply all styling
  applySheetStyling(sutm, {
    ...trackingArrays,
    ttdRows,
    lastDataRow: currentRow,
    totalStartRow: summaryResult.totalRows.material,
    totalEndRow: summaryResult.totalRows.total,
    transportRow,
  });

  const result = {
    totalAkhirBerat: totalAkhirBeratRef.value,
    materialPrices: summaryResult.materialPrices,
  };

  return result;
}

// REFACTORED writeCubicleSheet function
export async function writeCubicleSheet(
  cubicle: ExcelJS.Worksheet,
  survey: any,
  cubiclePrices: ICubiclePrice[],
  cubicleGroundings: IMaterialPrice[] = null,
  workbook: ExcelJS.Workbook,
) {
  const totalAkhirBeratRef = { value: 0 };
  const trackingArrays = {
    rowTitle: [] as number[],
  };

  // Setup header and basic info
  setupCommonHeader(cubicle, workbook, survey, 'RENCANA ANGGARAN BIAYA');

  cubicle.mergeCells('E12:G12');
  cubicle.getCell('E12').value = 'VOLUME';
  cubicle.getCell('H12').value = ':';
  cubicle.getCell('H12').alignment = { horizontal: 'center' };
  cubicle.getCell('I12').value = '-';
  cubicle.getCell('I12').alignment = { horizontal: 'center' };
  cubicle.getCell('J12').value = 'MS';
  cubicle.getCell('J12').alignment = { horizontal: 'center' };

  setupTableHeader(cubicle);
  formatWorksheetRow(cubicle, 17);

  let currentRow = 17;

  // CT TM section - Process all cubicle materials
  const allCubicleMaterials: IMaterialPrice[] = cubiclePrices.flatMap(
    price => price.materials,
  );
  currentRow = writeGroupedMaterialsWithHeaders(
    cubicle,
    currentRow,
    allCubicleMaterials,
    totalAkhirBeratRef,
    'CT TM',
    'main',
    { rowTitle: trackingArrays.rowTitle },
  );

  // GROUNDING section (if exists)
  if (cubicleGroundings && cubicleGroundings.length > 0) {
    currentRow++;
    formatWorksheetRow(cubicle, currentRow);

    currentRow = writeGroupedMaterialsWithHeaders(
      cubicle,
      currentRow,
      cubicleGroundings,
      totalAkhirBeratRef,
      'GROUNDING',
      'main',
      { rowTitle: trackingArrays.rowTitle },
    );
  }

  // PEKERJAAN PENDUKUNG section
  currentRow++;
  formatWorksheetRow(cubicle, currentRow);

  currentRow++;
  writeSectionHeader(cubicle, currentRow, 'PEKERJAAN PENDUKUNG', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const { lastRow: supportingLastRow, transportRow } =
    await writeSupportingMaterials(
      cubicle,
      currentRow,
      totalAkhirBeratRef.value,
      [534, 541], // Different materials for cubicle sheet
    );
  currentRow = supportingLastRow;

  // Summary section
  const summaryResult = writeSummarySection(cubicle, currentRow, currentRow);

  // Signature section
  const ttdRows = writeSignatureSection(cubicle, summaryResult.lastRow);

  // Apply styling (simpler than SUTM since no pole/konstruksi sections)
  applySheetStyling(cubicle, {
    rowTitle: trackingArrays.rowTitle,
    ttdRows,
    lastDataRow: currentRow,
    totalStartRow: summaryResult.totalRows.material,
    totalEndRow: summaryResult.totalRows.total,
    transportRow,
    // No pole/konstruksi/grounding arrays needed for cubicle sheet
    rowPoleSupport: [],
    rowKonstruksi: [],
    rowGrounding: [],
    rowTipePekerjaan: [],
  });

  const result = {
    totalAkhirBerat: totalAkhirBeratRef.value,
    materialPrices: summaryResult.materialPrices,
  };

  return result;
}

export async function writeSktmSheet(
  sktm: ExcelJS.Worksheet,
  survey: any,
  cablePrices: IMaterialPrice[],
  terminationPrices: IMaterialPrice[],
  arresterPrices: IMaterialPrice[],
  accessoryPrices: IMaterialPrice[],
  groundingPrices: ISktmGroundingPrice[],
  workbook: ExcelJS.Workbook,
) {
  const totalAkhirBeratRef = { value: 0 };
  const trackingArrays = {
    rowTitle: [] as number[],
    rowCable: [] as number[],
    rowSpelling: [] as number[],
    rowTermination: [] as number[],
    rowJoint: [] as number[],
  };

  // Header
  setupCommonHeader(sktm, workbook, survey, 'RENCANA ANGGARAN BIAYA');

  // Volume info (adjust as needed)
  sktm.mergeCells('E12:G12');
  sktm.getCell('E12').value = 'VOLUME';
  sktm.getCell('H12').value = ':';
  sktm.getCell('H12').alignment = { horizontal: 'center' };
  sktm.getCell('I12').value = '-';
  sktm.getCell('I12').alignment = { horizontal: 'center' };
  sktm.getCell('J12').value = 'MS';
  sktm.getCell('J12').alignment = { horizontal: 'center' };

  // Table header
  setupTableHeader(sktm);
  formatWorksheetRow(sktm, 17);

  let currentRow = 17;

  // Cable section
  for (const cable of cablePrices) {
    const title =
      cable.material.id == 138
        ? 'KONSTRUKSI UGC XLPE 150 mm'
        : 'KONSTRUKSI UGC XLPE 240 mm';

    currentRow++;
    writeSectionHeader(sktm, currentRow, title, 'main');
    trackingArrays.rowTitle.push(currentRow);
    trackingArrays.rowCable.push(currentRow);

    sktm.getCell(`H${currentRow}`).value = cable.total_kuantitas;
    sktm.getCell(`I${currentRow}`).value = cable.total_kuantitas;
    sktm.getCell(`J${currentRow}`).value = { formula: '0', result: 0 };

    sktm.getCell(`H${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    sktm.getCell(`I${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    sktm.getCell(`J${currentRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
  }

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'Kabel ditanam', 'sub');
  trackingArrays.rowTitle.push(currentRow);

  const plantedCable = currentRow;

  // const rowPlanted = currentRow;

  sktm.getCell(`H${currentRow}`).value = {
    formula: `${trackingArrays.rowCable.map(r => `H${r}`).join('+')}-16`,
  };
  sktm.getCell(`I${currentRow}`).value = {
    formula: `H${currentRow}`,
  };
  sktm.getCell(`J${currentRow}`).value = { formula: '0', result: 0 };
  sktm.getCell(`H${currentRow}`).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  sktm.getCell(`I${currentRow}`).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  sktm.getCell(`J${currentRow}`).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'Spelling Kabel yang ditanam', 'sub');
  trackingArrays.rowSpelling.push(currentRow);
  trackingArrays.rowTitle.push(currentRow);

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'Spelling Kabel Termination', 'sub');
  trackingArrays.rowSpelling.push(currentRow);
  trackingArrays.rowTitle.push(currentRow);

  currentRow = writeMaterialRows(
    sktm,
    currentRow,
    cablePrices,
    totalAkhirBeratRef,
  );

  currentRow++;
  formatWorksheetRow(sktm, currentRow);

  // Termination section
  currentRow++;
  writeSectionHeader(sktm, currentRow, 'TERMINATION', 'main');
  trackingArrays.rowTitle.push(currentRow);

  for (const termination of terminationPrices) {
    const id = termination.material.id;

    currentRow++;

    if ([231, 232, 233, 234].includes(id)) {
      trackingArrays.rowTermination.push(currentRow);
    } else {
      trackingArrays.rowJoint.push(currentRow);
    }

    totalAkhirBeratRef.value += termination.total_berat;

    const rowData = [
      { col: 'B', value: termination.material.nomor_material },
      { col: 'C', value: termination.material.nama_material },
      { col: 'D', value: termination.material.jenis_material, isAlign: true },
      {
        col: 'E',
        value: Number(termination.material.berat_material),
        isAlign: true,
      },
      { col: 'F', value: termination.material.satuan_material, isAlign: true },
      { col: 'G', value: termination.total_berat, isAlign: true },
      {
        col: 'H',
        value: termination.total_kuantitas,
        isAlign: true,
      },
      {
        col: 'I',
        value: termination.total_kuantitas,
        isAlign: true,
      },
      {
        col: 'J',
        value: { formula: '0', result: 0 },
        isAlign: true,
      },
      { col: 'K', value: termination.material.harga_material },
      { col: 'L', value: termination.material.pasang_rab },
      { col: 'N', value: termination.total_harga_material },
      { col: 'O', value: termination.total_pasang },
      {
        col: 'Q',
        value: termination.total_harga_material + termination.total_pasang,
      },
    ];

    writeMaterialRow(sktm, currentRow, rowData);
  }

  currentRow++;
  formatWorksheetRow(sktm, currentRow);

  for (const spelling of trackingArrays.rowSpelling) {
    const spellingFormula = `3*(${trackingArrays.rowTermination.map(r => `H${r}`).join('+')})`;
    sktm.getCell(`H${spelling}`).value = {
      formula: spellingFormula,
    };
    sktm.getCell(`I${spelling}`).value = {
      formula: `H${spelling}`,
    };
    sktm.getCell(`J${spelling}`).value = { formula: '0', result: 0 };
    sktm.getCell(`H${spelling}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    sktm.getCell(`I${spelling}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    sktm.getCell(`J${spelling}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
  }

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'PELAKSANAAN PENGGELARAN KABEL', 'main');
  trackingArrays.rowTitle.push(currentRow);

  currentRow++;
  writeSectionHeader(
    sktm,
    currentRow,
    'IDENTIFIKASI & PENGGALIAN KABEL',
    'main',
  );
  trackingArrays.rowTitle.push(currentRow);

  const identifikasiMaterial = await Material.findManyByIds([126, 158]);
  const identifikasiPrices: IMaterialPrice[] = identifikasiMaterial.map(
    item => ({
      material: item,
      total_kuantitas: 1,
      total_berat: (Number(item.berat_material) * 1) / 1000,
      total_harga_material: item.harga_material * 1,
      total_pasang: item.pasang_rab * 1,
      total_bongkar: 0,
    }),
  );

  currentRow = writeMaterialRows(
    sktm,
    currentRow,
    identifikasiPrices,
    totalAkhirBeratRef,
  );
  currentRow++;
  formatWorksheetRow(sktm, currentRow);

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'PENGGALIAN KABEL', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const penggalianMaterial = await Material.findManyByIds([157, 439, 39]);
  const penggalianPrices: IMaterialPrice[] = penggalianMaterial.map(item => ({
    material: item,
    total_kuantitas: (() => {
      switch (item.id) {
        case 157: {
          return { formula: `H${plantedCable} * 0.2 * 0.4` };
        }

        case 439: {
          return { formula: `ROUND(H${plantedCable} * 0.5 * 1.2, 0)` };
        }

        case 39: {
          return { formula: `TRUNC((H${plantedCable} / 0.5) / 1) * 1` };
        }

        default: {
          return Math.ceil((totalAkhirBeratRef.value * 100) / 100);
        }
      }
    })(),
    total_berat:
      (Number(item.berat_material) *
        Math.ceil((totalAkhirBeratRef.value * 100) / 100)) /
      1000,
    total_harga_material:
      item.harga_material * Math.ceil((totalAkhirBeratRef.value * 100) / 100),
    total_pasang:
      item.pasang_rab * Math.ceil((totalAkhirBeratRef.value * 100) / 100),
    total_bongkar: 0,
  }));
  currentRow = writeMaterialRows(
    sktm,
    currentRow,
    penggalianPrices,
    totalAkhirBeratRef,
  );
  currentRow++;
  formatWorksheetRow(sktm, currentRow);

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'ARRESTER & ACCESSORIES', 'main');
  trackingArrays.rowTitle.push(currentRow);

  // Arrester section
  currentRow = writeGroupedMaterialsWithHeaders(
    sktm,
    currentRow,
    arresterPrices,
    totalAkhirBeratRef,
    'ARRESTER',
    'main',
    { rowTitle: trackingArrays.rowTitle },
  );

  // Accessory section
  currentRow = writeGroupedMaterialsWithHeaders(
    sktm,
    currentRow,
    accessoryPrices,
    totalAkhirBeratRef,
    'ACCESSORIES',
    'main',
    { rowTitle: trackingArrays.rowTitle },
  );

  // GROUNDING section (if exists)
  if (groundingPrices.length > 0) {
    currentRow++;
    writeSectionHeader(sktm, currentRow, 'GROUNDING ARRESTER :', 'main');
    trackingArrays.rowTitle.push(currentRow);

    for (const grounding of groundingPrices) {
      currentRow = writeGroupedMaterialsWithHeaders(
        sktm,
        currentRow,
        grounding.materials,
        totalAkhirBeratRef,
        grounding.nama_grounding,
        'main',
        { rowTitle: trackingArrays.rowTitle },
      );
    }
  }

  currentRow++;
  writeSectionHeader(sktm, currentRow, 'PEKERJAAN PENDUKUNG', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const { lastRow: supportingLastRow, transportRow } =
    await writeSupportingMaterials(
      sktm,
      currentRow,
      totalAkhirBeratRef.value,
      [537, 534, 535, 541],
    );
  currentRow = supportingLastRow;

  // Summary
  const summaryResult = writeSummarySection(sktm, currentRow, currentRow);

  // Signature
  const ttdRows = writeSignatureSection(sktm, summaryResult.lastRow);

  // Styling
  applySheetStyling(sktm, {
    rowTitle: trackingArrays.rowTitle,
    ttdRows,
    lastDataRow: currentRow,
    totalStartRow: summaryResult.totalRows.material,
    totalEndRow: summaryResult.totalRows.total,
    transportRow,
    rowPoleSupport: [],
    rowKonstruksi: [],
    rowGrounding: [],
    rowTipePekerjaan: [],
  });

  const result = {
    totalAkhirBerat: totalAkhirBeratRef.value,
    materialPrices: summaryResult.materialPrices,
  };

  return result;
}

export async function writeAppTmSheet(
  apptm: ExcelJS.Worksheet,
  survey: any,
  workbook: ExcelJS.Workbook,
  appTmPrices: IMaterialPrice[],
) {
  const totalAkhirBeratRef = { value: 0 };
  const trackingArrays = {
    rowTitle: [] as number[],
  };

  // Header
  setupCommonHeader(apptm, workbook, survey, 'RENCANA ANGGARAN BIAYA');

  // Volume info (adjust as needed)
  apptm.mergeCells('E12:G12');
  apptm.getCell('E12').value = 'VOLUME';
  apptm.getCell('H12').value = ':';
  apptm.getCell('H12').alignment = { horizontal: 'center' };
  apptm.getCell('I12').value = '-';
  apptm.getCell('I12').alignment = { horizontal: 'center' };
  apptm.getCell('J12').value = 'MS';
  apptm.getCell('J12').alignment = { horizontal: 'center' };

  // Table header
  setupTableHeader(apptm);
  formatWorksheetRow(apptm, 17);

  let currentRow = 17;

  // APP TM section
  currentRow = writeGroupedMaterialsWithHeaders(
    apptm,
    currentRow,
    appTmPrices,
    totalAkhirBeratRef,
    'APP & METER',
    'main',
    { rowTitle: trackingArrays.rowTitle },
  );

  // Supporting materials
  currentRow++;
  formatWorksheetRow(apptm, currentRow);

  currentRow++;
  writeSectionHeader(apptm, currentRow, 'PEKERJAAN PENDUKUNG', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const { lastRow: supportingLastRow, transportRow } =
    await writeSupportingMaterials(
      apptm,
      currentRow,
      totalAkhirBeratRef.value,
      [534, 535, 541],
    );
  currentRow = supportingLastRow;

  // Summary
  const summaryResult = writeSummarySection(apptm, currentRow, currentRow);

  // Signature
  const ttdRows = writeSignatureSection(apptm, summaryResult.lastRow);

  // Styling
  applySheetStyling(apptm, {
    rowTitle: trackingArrays.rowTitle,
    ttdRows,
    lastDataRow: currentRow,
    totalStartRow: summaryResult.totalRows.material,
    totalEndRow: summaryResult.totalRows.total,
    transportRow,
    rowPoleSupport: [],
    rowKonstruksi: [],
    rowGrounding: [],
    rowTipePekerjaan: [],
  });

  const result = {
    totalAkhirBerat: totalAkhirBeratRef.value,
    materialPrices: summaryResult.materialPrices,
  };

  return result;
}

export async function writeSummarySheet(
  summary: ExcelJS.Worksheet,
  survey: any,
  workbook: ExcelJS.Workbook,
  appTmPrices: IMaterialPrice[],
) {
  const totalAkhirBeratRef = { value: 0 };
  const trackingArrays = {
    rowTitle: [] as number[],
  };

  // Header
  setupRekapHeader(summary, workbook, survey);

  // Table header
  setupSummaryHeader(summary);
  formatWorksheetRow(summary, 17);

  let currentRow = 17;

  // APP TM section
  currentRow = writeGroupedMaterialsWithHeaders(
    summary,
    currentRow,
    appTmPrices,
    totalAkhirBeratRef,
    'APP & METER',
    'main',
    { rowTitle: trackingArrays.rowTitle },
  );

  // Supporting materials
  currentRow++;
  formatWorksheetRow(summary, currentRow);

  currentRow++;
  writeSectionHeader(summary, currentRow, 'PEKERJAAN PENDUKUNG', 'main');
  trackingArrays.rowTitle.push(currentRow);

  const { lastRow: supportingLastRow, transportRow } =
    await writeSupportingMaterials(
      summary,
      currentRow,
      totalAkhirBeratRef.value,
      [534, 535, 541],
    );
  currentRow = supportingLastRow;

  // Summary
  const summaryResult = writeSummarySection(summary, currentRow, currentRow);

  // Signature
  const ttdRows = writeSignatureSection(summary, summaryResult.lastRow);

  // Styling
  applySheetStyling(summary, {
    rowTitle: trackingArrays.rowTitle,
    ttdRows,
    lastDataRow: currentRow,
    totalStartRow: summaryResult.totalRows.material,
    totalEndRow: summaryResult.totalRows.total,
    transportRow,
    rowPoleSupport: [],
    rowKonstruksi: [],
    rowGrounding: [],
    rowTipePekerjaan: [],
  });

  const result = {
    totalAkhirBerat: totalAkhirBeratRef.value,
    materialPrices: summaryResult.materialPrices,
  };

  return result;
}
