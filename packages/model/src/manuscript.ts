import { JSONSchemaType } from 'ajv';

export const manuscriptTypes = [
  'Original Research',
  'Review / Op-Ed / Letter / Hot Topic',
] as const;
export type ManuscriptType = (typeof manuscriptTypes)[number];

export const manuscriptLifecycles = [
  'Draft manuscript (prior to preprint submission)',
  'Draft manuscript',
  'Revised Draft Manuscript (prior to preprint submission)',
  'Revised Draft Manuscript',
  'Preprint, version 1',
  'Preprint, version 2',
  'Preprint, version 3+',
  'Typeset proof',
  'Publication',
  'Publication with addendum or corrigendum',
  'Other',
] as const;
export type ManuscriptLifecycle = (typeof manuscriptLifecycles)[number];

export type ManuscriptDataObject = {
  id: string;
  title: string;
  teamId: string;
  versions: ManuscriptVersion[];
};

export type ManuscriptVersion = {
  type: ManuscriptType;
  lifecycle: ManuscriptLifecycle;
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
