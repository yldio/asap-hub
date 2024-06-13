import { JSONSchemaType } from 'ajv';

export const manuscriptTypes = [
  'Original Research',
  'Review / Op-Ed / Letter / Hot Topic',
] as const;
export type ManuscriptType = (typeof manuscriptTypes)[number];

export const manuscriptLifecycles = [
  'Draft manuscript (prior to preprint submission)',
  'Revised Draft Manuscript (prior to preprint submission)',
  'Preprint, version 1',
  'Preprint, version 2',
  'Preprint, version 3+',
  'Typeset proof',
  'Publication',
  'Publication with addendum or corrigendum',
  'Other',
] as const;
export type ManuscriptLifecycle = (typeof manuscriptLifecycles)[number];

export const manuscriptTypeLifecycles: {
  lifecycle: ManuscriptLifecycle;
  types: ManuscriptType[];
}[] = [
  {
    lifecycle: 'Draft manuscript (prior to preprint submission)',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
  {
    lifecycle: 'Revised Draft Manuscript (prior to preprint submission)',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
  { lifecycle: 'Preprint, version 1', types: ['Original Research'] },
  { lifecycle: 'Preprint, version 2', types: ['Original Research'] },
  { lifecycle: 'Preprint, version 3+', types: ['Original Research'] },
  {
    lifecycle: 'Typeset proof',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
  {
    lifecycle: 'Publication',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
  {
    lifecycle: 'Publication with addendum or corrigendum',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
  {
    lifecycle: 'Other',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
];

export const apcCoverageOptions = ['Yes', 'No', 'Already submitted'] as const;

export type ApcCoverageOption = (typeof apcCoverageOptions)[number];

export type ManuscriptVersion = {
  type: ManuscriptType;
  lifecycle: ManuscriptLifecycle;
  preprintDoi?: string;
  publicationDoi?: string;
  requestingApcCoverage?: ApcCoverageOption;
  otherDetails?: string;
};

export const manuscriptFormFieldsMapping: Record<
  ManuscriptType,
  Record<ManuscriptLifecycle, Array<keyof ManuscriptVersion>>
> = {
  'Original Research': {
    'Draft manuscript (prior to preprint submission)': [],
    'Revised Draft Manuscript (prior to preprint submission)': [],
    'Preprint, version 1': ['preprintDoi'],
    'Preprint, version 2': ['preprintDoi'],
    'Preprint, version 3+': ['preprintDoi'],
    'Typeset proof': ['requestingApcCoverage'],
    Publication: ['preprintDoi', 'publicationDoi', 'requestingApcCoverage'],
    'Publication with addendum or corrigendum': [
      'preprintDoi',
      'publicationDoi',
      'requestingApcCoverage',
    ],
    Other: ['otherDetails'],
  },
  'Review / Op-Ed / Letter / Hot Topic': {
    'Draft manuscript (prior to preprint submission)': [],
    'Revised Draft Manuscript (prior to preprint submission)': [],
    'Preprint, version 1': [],
    'Preprint, version 2': [],
    'Preprint, version 3+': [],
    'Typeset proof': ['requestingApcCoverage'],
    Publication: ['publicationDoi', 'requestingApcCoverage'],
    'Publication with addendum or corrigendum': [
      'publicationDoi',
      'requestingApcCoverage',
    ],
    Other: ['otherDetails'],
  },
};

export type ManuscriptDataObject = {
  id: string;
  title: string;
  teamId: string;
  versions: ManuscriptVersion[];
};

export type ManuscriptResponse = ManuscriptDataObject;

export type ManuscriptPostRequest = Pick<
  ManuscriptDataObject,
  'title' | 'teamId'
> & {
  versions: {
    type: ManuscriptVersion['type'] | '';
    lifecycle: ManuscriptVersion['lifecycle'] | '';
    preprintDoi?: ManuscriptVersion['preprintDoi'];
    publicationDoi?: ManuscriptVersion['publicationDoi'] | '';
    requestingApcCoverage?: ManuscriptVersion['requestingApcCoverage'] | '';
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
  }[];
};

export type ManuscriptCreateDataObject = ManuscriptPostRequest;

export const manuscriptPostRequestSchema: JSONSchemaType<ManuscriptPostRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      teamId: { type: 'string' },
      versions: {
        type: 'array',
        maxItems: 1,
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            type: { enum: manuscriptTypes, type: 'string' },
            lifecycle: { enum: manuscriptLifecycles, type: 'string' },
            preprintDoi: { type: 'string', nullable: true },
            publicationDoi: { type: 'string', nullable: true },
            requestingApcCoverage: {
              enum: apcCoverageOptions,
              type: 'string',
              nullable: true,
            },
            otherDetails: { type: 'string', nullable: true },
          },
          required: ['type', 'lifecycle'],
          additionalProperties: false,
        },
      },
    },
    required: ['title', 'teamId', 'versions'],
    additionalProperties: false,
  };
