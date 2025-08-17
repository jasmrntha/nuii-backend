import { type SktmMatType } from '@prisma/client';

/* eslint-disable @typescript-eslint/naming-convention */
interface SKTMDetail {
  id: number;
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

interface SKTMComponent {
  id: number;
  id_material: number;
  tipe_material: SktmMatType;
  kuantitas: number;
  keterangan?: string;
}

interface SKTMJoint {
  id: number;
  id_material_kabel: number;
  id_material_joint: number;
  lat: string;
  long: string;
  urutan: number;
}

interface Survey {
  id: number;
  details: SKTMDetail[];
  components: SKTMComponent[];
  joints: SKTMJoint[];
}

type RequireIdAndPartial<T> = {
  id: T extends { id: infer U } ? U : never;
} & {
  [P in keyof T as Exclude<P, 'id'>]?: T[P] extends Array<infer U>
    ? Array<RequireIdAndPartial<U>>
    : T[P] extends object
      ? RequireIdAndPartial<T[P]>
      : T[P];
};

export type UpdateSKTMDetailRequest = RequireIdAndPartial<Survey>;
