/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

export const CreateSKTMDetailSchema = Joi.object({
  id_survey_header: Joi.number().integer().positive().required(),
  id_sktm_survey: Joi.number().integer().positive().optional(),
  id_kabel: Joi.number().integer().positive().optional(),
  id_termination_masuk: Joi.number().integer().positive().optional(),
  id_termination_keluar: Joi.number().integer().positive().optional(),

  penyulang: Joi.string().required(),
  panjang_jaringan: Joi.number().positive().required(),
  diameter_kabel: Joi.number().positive().required(),
  long: Joi.string().required(),
  lat: Joi.string().required(),
  foto: Joi.string().required(),
  keterangan: Joi.string().required(),
  petugas_survey: Joi.string().required(),
  has_arrester: Joi.boolean().required(),
});
