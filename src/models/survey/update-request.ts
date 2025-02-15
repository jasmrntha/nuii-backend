import { type SurveyStatus } from '@prisma/client';

/* eslint-disable @typescript-eslint/naming-convention */
interface SurveyHeader {
  nama_survey: string;
  lokasi: string;
  user_id: string;
  status_survey: SurveyStatus;
}

interface SurveyDetail {
  id_material_tiang: string;
  id_material_konduktor: string;
  id_konstruksi: string;
  id_header: string;
  nama_pekerjaan: string;
  penyulang: string;
  panjang_jaringan: bigint;
  long: string;
  lat: string;
  foto: string;
  keterangan: string;
  petugas_survey: string;
}

export interface UpdateSurveyHeaderRequest {
  id_header: string;
  header: SurveyHeader;
}

export interface UpdateSurveyDetailRequest {
  id_detail: string;
  detail: SurveyDetail;
}
