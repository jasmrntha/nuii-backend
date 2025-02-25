/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyStatus } from '@prisma/client';
import Joi from 'joi';

const SurveyHeaderSchema = Joi.object({
  nama_survey: Joi.string().required(),
  lokasi: Joi.string().required(),
  user_id: Joi.string().required(),
  status_survey: Joi.string()
    .valid(...Object.values(SurveyStatus))
    .required(),
  id_material_konduktor: Joi.number().integer().positive().required(),
  nama_pekerjaan: Joi.string().required(),
});

const SurveyDetailSchema = Joi.object({
  id_material_tiang: Joi.number().integer().positive().required(),
  id_konstruksi: Joi.number().integer().positive().required(),
  id_pole: Joi.number().integer().positive().optional(),
  id_grounding: Joi.number().integer().positive().optional(),
  penyulang: Joi.string().required(),
  panjang_jaringan: Joi.number().min(0).required(),
  long: Joi.string().required(),
  lat: Joi.string().required(),
  foto: Joi.string().required(),
  keterangan: Joi.string().allow('').optional(),
  petugas_survey: Joi.string().required(),
});

export const CreateNewSurveySchema = Joi.object({
  header: SurveyHeaderSchema.required(),
  detail: SurveyDetailSchema.required(),
});

export const CreateSurveySchema = Joi.object({
  id_header: Joi.number().integer().positive().required(),
  detail: SurveyDetailSchema.required(),
});
