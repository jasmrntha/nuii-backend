/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

export const UpdateSKTMDetailSchema = Joi.object({
  // Survey root
  id: Joi.number().integer().positive().required(),

  // Optional arrays; each element must have its own id, other fields are partial
  details: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        penyulang: Joi.string().optional(),
        panjang_jaringan: Joi.number().positive().optional(),
        diameter_kabel: Joi.number().positive().optional(),
        long: Joi.string().optional(),
        lat: Joi.string().optional(),
        foto: Joi.string().optional(),
        keterangan: Joi.string().optional(),
        petugas_survey: Joi.string().optional(),
        has_arrester: Joi.boolean().optional(),
      }),
    )
    .optional(),

  components: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        id_material: Joi.number().integer().positive().optional(),
        // If you want to restrict to specific enum values later, replace with .valid(...)
        tipe_material: Joi.string().optional(),
        kuantitas: Joi.number().integer().min(0).optional(),
        keterangan: Joi.string().allow('').optional(),
      }),
    )
    .optional(),

  joints: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        id_material_kabel: Joi.number().integer().positive().optional(),
        id_material_joint: Joi.number().integer().positive().optional(),
        lat: Joi.string().optional(),
        long: Joi.string().optional(),
        urutan: Joi.number().integer().min(0).optional(),
      }),
    )
    .optional(),
});
