/* eslint-disable @typescript-eslint/naming-convention */
// import { SurveyStatus } from '@prisma/client';
import Joi from 'joi';

const SurveyHeaderSchema = Joi.object({
  nama_survey: Joi.string().required(),
  lokasi: Joi.string().required(),
  user_id: Joi.string().required(),
  id_material_konduktor: Joi.number().integer().positive().required(),
  nama_pekerjaan: Joi.string().required(),
});

const SurveyDetailSchema = Joi.object({
  id_material_tiang: Joi.number().integer().positive().required(),
  id_konstruksi: Joi.number().integer().positive().required(),
  id_pole_supporter: Joi.number().integer().positive().optional(),
  id_grounding_termination: Joi.number().integer().positive().optional(),
  penyulang: Joi.string().required(),
  panjang_jaringan: Joi.number().min(0).required(),
  long: Joi.string().required(),
  lat: Joi.string().required(),
  foto: Joi.string().optional(),
  keterangan: Joi.string().allow('').optional(),
  petugas_survey: Joi.string().required(),
});

export const CreateBatchSurveySchema = Joi.object({
  header: SurveyHeaderSchema.required(),
  details: Joi.array().items(SurveyDetailSchema).min(1).required(),
});
