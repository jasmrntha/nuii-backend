/* eslint-disable @typescript-eslint/naming-convention */
interface SKTMDetail {
  penyulang: string;
  panjang_jaringan: number;
  diameter_kabel: number;
  long: string;
  lat: string;
  foto: string;
  keterangan: string;
  petugas_survey: string;
  has_arrester: boolean;
}

export interface CreateSKTMDetailRequest extends SKTMDetail {
  id_sktm_survey: number;
  id_kabel?: number;
  id_termination_masuk?: number;
  id_termination_keluar?: number;
}
