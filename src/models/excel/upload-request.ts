/* eslint-disable @typescript-eslint/naming-convention */
interface SurveyHeader {
  nama_survey: string;
  nama_pekerjaan: string;
  lokasi: string;
  user_id: string;
  id_material_konduktor: number;
}

interface ExcelArchive {
  file_name: string;
  file_path: string;
}

export interface UploadExcelRequest {
  header: SurveyHeader;
  file: ExcelArchive;
}
