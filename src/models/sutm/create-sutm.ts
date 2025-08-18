/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
interface SUTMDetail {
  id_material_tiang: number;
  id_konstruksi: number;
  id_pole_supporter: number;
  id_grounding_termination: number;
  penyulang: string;
  panjang_jaringan: number;
  long: string;
  lat: string;
  foto: string;
  keterangan: string;
  petugas_survey: string;
}

export interface CreateSUTMDetailRRequest extends SUTMDetail {
  id_survey_header?: number;
  id_sutm_survey?: number;
  id_material_konduktor?: number;
}
