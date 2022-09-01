import * as JoiBase from 'joi';
import joiDate from '@joi/date';

const Joi = JoiBase.extend(joiDate);

export const joiEnum = (enumObj: Object) =>
  Joi.string().valid(...Object.values(enumObj));
export const joiMongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
export const joiMinioId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
