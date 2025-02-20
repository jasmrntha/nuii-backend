/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

const SurveyDetailSchema = Joi.object({
  id_material_tiang: Joi.number().integer().positive().required(),
  id_material_konduktor: Joi.number().integer().positive().required(),
  id_konstruksi: Joi.number().integer().positive().required(),
  id_header: Joi.number().integer().positive().required(),
  nama_pekerjaan: Joi.string().required(),
  penyulang: Joi.string().required(),
  panjang_jaringan: Joi.number().min(0).required(),
  long: Joi.string().required(),
  lat: Joi.string().required(),
  foto: Joi.string().required(),
  keterangan: Joi.string().allow('').optional(),
  petugas_survey: Joi.string().required(),
});

export const UpdateSurveyDetailSchema = Joi.object({
  id_detail: Joi.number().integer().positive().required(),
  detail: SurveyDetailSchema.required(),
});
