/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

export const CreateMaterialSchema = Joi.object({
  id_tipe_material: Joi.number().integer().positive().required(),
  nama_material: Joi.string().required(),
  nomor_material: Joi.number().integer().positive().required(),
  satuan: Joi.string().required(),
  berat: Joi.number().positive().required(),
  harga_material: Joi.number().integer().min(0).required(),
  pasang_rab: Joi.number().integer().min(0).required(),
  bongkar: Joi.number().integer().min(0).required(),
  jenis_material: Joi.string().required(),
  kategori_material: Joi.string().required(),
});
