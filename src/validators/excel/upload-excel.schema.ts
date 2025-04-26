/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

export const UploadExcelSchema = Joi.object({
  header: Joi.object({
    nama_survey: Joi.string().required(),
    nama_pekerjaan: Joi.string().required(),
    lokasi: Joi.string().required(),
    user_id: Joi.string().required(),
    id_material_konduktor: Joi.number().integer().positive().required(),
  }).required(),
  file: Joi.object({
    file_name: Joi.string().required(),
    file_path: Joi.string().required(),
  }).required(),
});
