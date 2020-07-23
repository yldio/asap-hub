import Joi from '@hapi/joi';

export interface CMSUser {
  id: string;
  data: {
    displayName: { iv: string };
    email: { iv: string };
    firstName: { iv: string };
    middleName: { iv: string };
    lastName: { iv: string };
    title: { iv: string };
    orcid: { iv: string };
    institution: { iv: string };
    connections: { iv: [{ code: string }] };
  };
}

export const createSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string(),
  middleName: Joi.string(),
  lastName: Joi.string(),
  title: Joi.string(),
  orcid: Joi.string(),
  institution: Joi.string(),
  connections: Joi.string(),
});
