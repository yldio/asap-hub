import { JSONSchemaType } from 'ajv';

export type ManuscriptDataObject = {
  id: string;
  title: string;
  teamId: string;
};

export type ManuscriptResponse = ManuscriptDataObject;

export type ManuscriptPostRequest = Pick<
  ManuscriptDataObject,
  'title' | 'teamId'
>;

export type ManuscriptCreateDataObject = ManuscriptPostRequest;

export const manuscriptPostRequestSchema: JSONSchemaType<ManuscriptPostRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      teamId: { type: 'string' },
    },
    required: ['title'],
    additionalProperties: false,
  };
