/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

export const CreateSutmSchema = Joi.object({
  id_material_tiang: Joi.number().integer().positive().required(),
  id_konstruksi: Joi.number().integer().positive().required(),
  id_pole_supporter: Joi.number().integer().positive().optional().allow(null),
  id_grounding_termination: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  penyulang: Joi.string().required(),
  panjang_jaringan: Joi.number().min(0).required(),
  long: Joi.string().required(),
  lat: Joi.string().required(),
  foto: Joi.string().required(),
  keterangan: Joi.string().allow('').optional(),
  petugas_survey: Joi.string().required(),
  id_survey_header: Joi.number().integer().positive().optional(),
  id_sutm_survey: Joi.number().integer().positive().optional(),
  id_material_konduktor: Joi.number().integer().positive().optional(),
});
