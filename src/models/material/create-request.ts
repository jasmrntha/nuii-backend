/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateMaterialRequest {
  id_tipe_material: number;
  nama_material: string;
  nomor_material: number;
  satuan: string;
  berat: number;
  harga_material: number;
  pasang_rab: number;
  bongkar: number;
  jenis_material: string;
  kategori_material: string;
}
