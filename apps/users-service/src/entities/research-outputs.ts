import Joi from '@hapi/joi';

export interface CMSResearchOutput {
  id: string;
  created: string;
  data: {
    url: { iv: string };
    doi: { iv: string };
    outputType: { iv: string };
    title: { iv: string };
    description: { iv: string };
    authors: {
      iv: [
        {
          name: string;
          id: string;
        },
      ];
    };
    publishDate: { iv: string };
    createdBy: { iv: string };
  };
}

export const createSchema = Joi.object({
  url: Joi.string().required(),
  doi: Joi.string(),
  outputType: Joi.string()
    .required()
    .valid('dataset', 'code', 'protocol', 'resource', 'preprint', 'other'),
  title: Joi.string().required(),
  description: Joi.string().required(),
  authors: Joi.array()
    .items(Joi.object({ name: Joi.string(), id: Joi.string() }))
    .required(),
  publishDate: Joi.date().iso(),
});
