import Joi from '@hapi/joi';

export interface User {
  id: string;
  data: {
    displayName: { iv: string };
    email: { iv: string };
    connections: { iv: [{ code: string }] };
  };
}

export const createSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().required(),
});
