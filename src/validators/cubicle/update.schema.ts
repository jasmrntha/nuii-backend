/* eslint-disable @typescript-eslint/naming-convention */
import { CubicleType } from '@prisma/client';
import Joi from 'joi';

export const UpdateCubicleSchema = Joi.object({
  // Defaults per your rule
  id_cubicle_material: Joi.number().integer().positive().optional(),
  cubicle_type: Joi.string()
    .valid(...Object.values(CubicleType))
    .optional(),

  has_grounding: Joi.boolean().optional(),
  penyulang: Joi.string().trim().optional(),
  long: Joi.string().trim().optional(),
  lat: Joi.string().trim().optional(),
  foto: Joi.string().trim().optional(),
  keterangan: Joi.string().optional(),
  petugas_survey: Joi.string().trim().optional(),
});
