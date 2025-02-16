import { type SurveyStatus } from '@prisma/client';

/* eslint-disable @typescript-eslint/naming-convention */
interface SurveyHeader {
  nama_survey: string;
  lokasi: string;
  user_id: string;
  status_survey: SurveyStatus;
}

interface SurveyDetail {
  id_material_tiang: number;
  id_material_konduktor: number;
  id_konstruksi: number;
  id_header: number;
  nama_pekerjaan: string;
  penyulang: string;
  panjang_jaringan: number;
  long: string;
  lat: string;
  foto: string;
  keterangan: string;
  petugas_survey: string;
}

export interface UpdateSurveyHeaderRequest {
  id_header: number;
  header: SurveyHeader;
}

export interface UpdateSurveyDetailRequest {
  id_detail: number;
  detail: SurveyDetail;
}
