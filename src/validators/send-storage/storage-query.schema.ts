import Joi from 'joi';

export const storageQueryValidate = Joi.object({
  token: Joi.string().required(),
});
