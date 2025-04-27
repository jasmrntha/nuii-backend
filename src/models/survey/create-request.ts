import { type SurveyStatus } from '@prisma/client';

/* eslint-disable @typescript-eslint/naming-convention */
interface SurveyHeader {
  nama_survey: string;
  nama_pekerjaan: string;
  lokasi: string;
  user_id: string;
  status_survey: SurveyStatus;
  id_material_konduktor: number;
}

interface SurveyDetail {
  id_material_tiang: number;
  id_konstruksi: number;
  id_pole_supporter: number;
  id_grounding_termination: number;
  nama_pekerjaan: string;
  penyulang: string;
  panjang_jaringan: number;
  long: string;
  lat: string;
  foto: string;
  keterangan: string;
  petugas_survey: string;
}

export interface CreateNewSurveyRequest {
  header: SurveyHeader;
  detail: SurveyDetail;
}

export interface CreateSurveyRequest {
  id_header: number;
  detail: SurveyDetail;
}
