import Joi from '@hapi/joi';

export interface CMSResearchOutput {
  id: string;
  created: string;
  data: {
    url: { iv: string };
    doi: { iv: string };
    type: { iv: 'proposal' };
    title: { iv: string };
    text: { iv: string };
    publishDate: { iv: string };
  };
}

export const createSchema = Joi.object({
  url: Joi.string().required(),
  doi: Joi.string(),
  type: Joi.string().required().valid('proposal'),
  accessLevel: Joi.string().required().valid('private', 'team', 'public'),
  title: Joi.string().required(),
  text: Joi.string().required(),
  authors: Joi.array()
    .items(Joi.object({ displayName: Joi.string(), id: Joi.string() }))
    .required(),
  publishDate: Joi.date().iso(),
});
