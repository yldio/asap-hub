import Joi from '@hapi/joi';

export interface CMSContent {
  id: string;
  created: string;
  data: {
    slug: { iv: string };
  };
}

export const CreateSchema = Joi.object({
  content: Joi.string().required().valid('news'),
  slug: Joi.string().required(),
}).required();
