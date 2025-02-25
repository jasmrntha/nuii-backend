/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyStatus } from '@prisma/client';
import Joi from 'joi';

const SurveyHeaderSchema = Joi.object({
  nama_survey: Joi.string().required(),
  nama_pekerjaan: Joi.string().required(),
  lokasi: Joi.string().required(),
  user_id: Joi.string().required(),
  status_survey: Joi.string()
    .valid(...Object.values(SurveyStatus))
    .required(),
  id_material_konduktor: Joi.number().integer().positive().required(),
});

export const UpdateSurveyHeaderSchema = Joi.object({
  id_header: Joi.number().integer().positive().required(),
  header: SurveyHeaderSchema.required(),
});
