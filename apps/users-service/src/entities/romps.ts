import Joi from '@hapi/joi';

export interface Romp {
 id: string;
 created: string;
 data: {
   url: { iv: string };
   doi: { iv: string };
   outputType: { iv: string };
   title: { iv: string };
   description: { iv: string };
   authors: { iv: [{
     name: string;
     id: string
   }]};
   publishingDate: { iv: string };
   creator: { iv: string };
 };
}

export const createSchema = Joi.object({
 url: Joi.string().required(),
 doi: Joi.string(),
 outputType: Joi.string().required().allow(['dataset', 'code', 'protocol', 'resource', 'preprint', 'other']),
 title: Joi.string().required(),
 description: Joi.string().required(),
 authors: Joi.array().items(Joi.string().required()).required(),
 publishingDate: Joi.date(),
});
