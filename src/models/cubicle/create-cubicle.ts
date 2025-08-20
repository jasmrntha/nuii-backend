import { type CubicleType } from '@prisma/client';

/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateCubicle {
  id_cubicle_material: number;
  cubicle_type: CubicleType;
  has_grounding: boolean;
  penyulang: string;
  long: string;
  lat: string;
  foto: string;
  keterangan?: string;
  petugas_survey: string;
  id_survey_header: number;
}
