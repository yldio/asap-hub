import Joi from '@hapi/joi';

export interface CMSResearchOutput {
  id: string;
  created: string;
  data: {
    url: { iv: string };
    doi: { iv: string };
    type: { iv: string };
    title: { iv: string };
    description: { iv: string };
    accessLevel: { iv: string };
    authors: {
      iv: [
        {
          displayName: string;
          id: string;
        },
      ];
    };
    publishDate: { iv: string };
    createdBy: {
      iv: [
        {
          id: string;
          displayName: string;
        },
      ];
    };
  };
}

export const createSchema = Joi.object({
  url: Joi.string().required(),
  doi: Joi.string(),
  type: Joi.string()
    .required()
    .valid('dataset', 'code', 'protocol', 'resource', 'preprint', 'other'),
  accessLevel: Joi.string().required().valid('private', 'team', 'public'),
  title: Joi.string().required(),
  description: Joi.string().required(),
  authors: Joi.array()
    .items(Joi.object({ displayName: Joi.string(), id: Joi.string() }))
    .required(),
  publishDate: Joi.date().iso(),
});
