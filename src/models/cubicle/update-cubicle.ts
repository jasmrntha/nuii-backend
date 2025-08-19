import { type CubicleType } from '@prisma/client';

/* eslint-disable @typescript-eslint/naming-convention */
export interface UpdateCubicle {
  id_cubicle_material?: number;
  cubicle_type?: CubicleType;
  has_grounding?: boolean;
  penyulang?: string;
  long?: number;
  lat?: number;
  foto?: string;
  keterangan?: string;
  petugas_survey?: string;
}
