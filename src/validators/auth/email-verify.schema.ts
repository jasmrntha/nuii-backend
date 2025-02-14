import Joi from 'joi';

export const emailVerify = Joi.object({
  email: Joi.string().required(),
});
