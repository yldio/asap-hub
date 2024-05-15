import { JSONSchemaType } from 'ajv';

export type ManuscriptDataObject = {
  id: string;
  title: string;
};

export type ManuscriptResponse = ManuscriptDataObject;

export type ManuscriptPostRequest = Pick<ManuscriptDataObject, 'title'>;

export type ManuscriptCreateDataObject = ManuscriptPostRequest;

export const manuscriptPostRequestSchema: JSONSchemaType<ManuscriptPostRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
    },
    required: ['title'],
    additionalProperties: false,
  };
