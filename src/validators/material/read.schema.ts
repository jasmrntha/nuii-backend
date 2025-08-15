/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

export const GetSurveyMaterialSchema = Joi.object({
  table: Joi.string()
    .valid(
      'kabelMaterial',
      'accessoryMaterial',
      'terminasiMaterial',
      'jointingMaterial',
    )
    .required(),

  survey: Joi.string().valid('SUTM', 'SKTM', 'CUBICLE', 'APP_TM').required(),
});
