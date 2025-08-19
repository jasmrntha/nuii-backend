/* eslint-disable @typescript-eslint/naming-convention */
import { CubicleType } from '@prisma/client';
import Joi from 'joi';

export const CreateCubicleSchema = Joi.object({
  id_survey_header: Joi.number().integer().positive().required(),

  // Defaults per your rule
  id_cubicle_material: Joi.number().integer().positive().optional(),
  cubicle_type: Joi.string()
    .valid(...Object.values(CubicleType))
    .optional(),

  has_grounding: Joi.boolean().required(),
  penyulang: Joi.string().trim().required(),
  long: Joi.string().trim().required(),
  lat: Joi.string().trim().required(),
  foto: Joi.string().trim().required(),
  keterangan: Joi.string().optional(),
  petugas_survey: Joi.string().trim().required(),
});
