import { JSONSchemaType } from 'ajv';
import { UserResponse } from './user';

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

export type ManuscriptFileResponse = {
  id: string;
  filename: string;
  url: string;
};

type ManuscriptFile = ManuscriptFileResponse;

export type ManuscriptVersion = {
  type: ManuscriptType;
  lifecycle: ManuscriptLifecycle;
  preprintDoi?: string;
  publicationDoi?: string;
  requestingApcCoverage?: ApcCoverageOption;
  otherDetails?: string;
  manuscriptFile: ManuscriptFile;

  acknowledgedGrantNumber?: string;
  asapAffiliationIncluded?: string;
  manuscriptLicense?: string;
  datasetsDeposited?: string;
  codeDeposited?: string;
  protocolsDeposited?: string;
  labMaterialsRegistered?: string;

  acknowledgedGrantNumberDetails?: string;
  asapAffiliationIncludedDetails?: string;
  manuscriptLicenseDetails?: string;
  datasetsDepositedDetails?: string;
  codeDepositedDetails?: string;
  protocolsDepositedDetails?: string;
  labMaterialsRegisteredDetails?: string;

  teams: { displayName: string; id: string; inactiveSince?: string }[];
  labs: { name: string; id: string }[];

  createdBy: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'avatarUrl'
    | 'alumniSinceDate'
  > & {
    teams: { id: string; name: string }[];
  };
  publishedAt: string;
};

export const manuscriptFormFieldsMapping: Record<
  ManuscriptType,
  Record<
    ManuscriptLifecycle,
    Array<keyof Omit<ManuscriptVersion, 'createdBy' | 'publishedAt'>>
  >
> = {
  'Original Research': {
    'Draft manuscript (prior to preprint submission)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    'Revised Draft Manuscript (prior to preprint submission)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    'Preprint, version 1': [
      'preprintDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    'Preprint, version 2': [
      'preprintDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    'Preprint, version 3+': [
      'preprintDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    'Typeset proof': [
      'requestingApcCoverage',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    Publication: [
      'preprintDoi',
      'publicationDoi',
      'requestingApcCoverage',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    'Publication with addendum or corrigendum': [
      'preprintDoi',
      'publicationDoi',
      'requestingApcCoverage',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
    Other: [
      'otherDetails',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ],
  },
  'Review / Op-Ed / Letter / Hot Topic': {
    'Draft manuscript (prior to preprint submission)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
    ],
    'Revised Draft Manuscript (prior to preprint submission)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
    ],
    'Preprint, version 1': [],
    'Preprint, version 2': [],
    'Preprint, version 3+': [],
    'Typeset proof': [
      'requestingApcCoverage',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
    ],
    Publication: [
      'publicationDoi',
      'requestingApcCoverage',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
    ],
    'Publication with addendum or corrigendum': [
      'publicationDoi',
      'requestingApcCoverage',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
    ],
    Other: [
      'otherDetails',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
    ],
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
  eligibilityReasons: string[];
  versions: {
    type: ManuscriptVersion['type'] | '';
    lifecycle: ManuscriptVersion['lifecycle'] | '';
    preprintDoi?: ManuscriptVersion['preprintDoi'];
    publicationDoi?: ManuscriptVersion['publicationDoi'] | '';
    requestingApcCoverage?: ManuscriptVersion['requestingApcCoverage'] | '';
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
    manuscriptFile: ManuscriptVersion['manuscriptFile'];

    acknowledgedGrantNumber?: ManuscriptVersion['acknowledgedGrantNumber'];
    asapAffiliationIncluded?: ManuscriptVersion['asapAffiliationIncluded'];
    manuscriptLicense?: ManuscriptVersion['manuscriptLicense'];
    datasetsDeposited?: ManuscriptVersion['datasetsDeposited'];
    codeDeposited?: ManuscriptVersion['codeDeposited'];
    protocolsDeposited?: ManuscriptVersion['protocolsDeposited'];
    labMaterialsRegistered?: ManuscriptVersion['labMaterialsRegistered'];

    acknowledgedGrantNumberDetails?: ManuscriptVersion['acknowledgedGrantNumberDetails'];
    asapAffiliationIncludedDetails?: ManuscriptVersion['asapAffiliationIncludedDetails'];
    manuscriptLicenseDetails?: ManuscriptVersion['manuscriptLicenseDetails'];
    datasetsDepositedDetails?: ManuscriptVersion['datasetsDepositedDetails'];
    codeDepositedDetails?: ManuscriptVersion['codeDepositedDetails'];
    protocolsDepositedDetails?: ManuscriptVersion['protocolsDepositedDetails'];
    labMaterialsRegisteredDetails?: ManuscriptVersion['labMaterialsRegisteredDetails'];

    teams: string[];
    labs?: string[];
  }[];
};

type MultiselectOption = {
  label: string;
  value: string;
  isFixed?: boolean;
};

export type ManuscriptFormData = Pick<
  ManuscriptPostRequest,
  'title' | 'teamId' | 'eligibilityReasons'
> & {
  versions: {
    type: ManuscriptVersion['type'] | '';
    lifecycle: ManuscriptVersion['lifecycle'] | '';
    preprintDoi?: ManuscriptVersion['preprintDoi'];
    publicationDoi?: ManuscriptVersion['publicationDoi'] | '';
    requestingApcCoverage?: ManuscriptVersion['requestingApcCoverage'] | '';
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
    manuscriptFile: ManuscriptVersion['manuscriptFile'];

    acknowledgedGrantNumber?: ManuscriptVersion['acknowledgedGrantNumber'];
    asapAffiliationIncluded?: ManuscriptVersion['asapAffiliationIncluded'];
    manuscriptLicense?: ManuscriptVersion['manuscriptLicense'];
    datasetsDeposited?: ManuscriptVersion['datasetsDeposited'];
    codeDeposited?: ManuscriptVersion['codeDeposited'];
    protocolsDeposited?: ManuscriptVersion['protocolsDeposited'];
    labMaterialsRegistered?: ManuscriptVersion['labMaterialsRegistered'];

    acknowledgedGrantNumberDetails?: ManuscriptVersion['acknowledgedGrantNumberDetails'];
    asapAffiliationIncludedDetails?: ManuscriptVersion['asapAffiliationIncludedDetails'];
    manuscriptLicenseDetails?: ManuscriptVersion['manuscriptLicenseDetails'];
    datasetsDepositedDetails?: ManuscriptVersion['datasetsDepositedDetails'];
    codeDepositedDetails?: ManuscriptVersion['codeDepositedDetails'];
    protocolsDepositedDetails?: ManuscriptVersion['protocolsDepositedDetails'];
    labMaterialsRegisteredDetails?: ManuscriptVersion['labMaterialsRegisteredDetails'];

    teams: MultiselectOption[];
    labs: MultiselectOption[];
  }[];
};

export type ManuscriptCreateDataObject = ManuscriptPostRequest & {
  userId: string;
};

export const manuscriptPostRequestSchema: JSONSchemaType<ManuscriptPostRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      teamId: { type: 'string' },
      eligibilityReasons: {
        type: 'array',
        items: { type: 'string' },
        minItems: 0,
      },
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
            manuscriptFile: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                filename: { type: 'string', nullable: true },
                url: { type: 'string', nullable: true },
              },
              nullable: true,
              required: ['id'],
            },
            acknowledgedGrantNumber: { type: 'string', nullable: true },
            asapAffiliationIncluded: { type: 'string', nullable: true },
            manuscriptLicense: { type: 'string', nullable: true },
            datasetsDeposited: { type: 'string', nullable: true },
            codeDeposited: { type: 'string', nullable: true },
            protocolsDeposited: { type: 'string', nullable: true },
            labMaterialsRegistered: { type: 'string', nullable: true },
            acknowledgedGrantNumberDetails: { type: 'string', nullable: true },
            asapAffiliationIncludedDetails: { type: 'string', nullable: true },
            manuscriptLicenseDetails: { type: 'string', nullable: true },
            datasetsDepositedDetails: { type: 'string', nullable: true },
            codeDepositedDetails: { type: 'string', nullable: true },
            protocolsDepositedDetails: { type: 'string', nullable: true },
            labMaterialsRegisteredDetails: { type: 'string', nullable: true },

            teams: { type: 'array', minItems: 1, items: { type: 'string' } },
            labs: { type: 'array', nullable: true, items: { type: 'string' } },
          },
          required: ['type', 'lifecycle'],
          additionalProperties: false,
        },
      },
    },
    required: ['title', 'teamId', 'versions'],
    additionalProperties: false,
  };

export const questionChecksOptions = ['Yes', 'No'] as const;

export type QuestionChecksOption = (typeof questionChecksOptions)[number];

export type QuickCheck =
  | 'acknowledgedGrantNumber'
  | 'asapAffiliationIncluded'
  | 'manuscriptLicense'
  | 'datasetsDeposited'
  | 'codeDeposited'
  | 'protocolsDeposited'
  | 'labMaterialsRegistered';

export type QuickCheckDetails =
  | 'acknowledgedGrantNumberDetails'
  | 'asapAffiliationIncludedDetails'
  | 'manuscriptLicenseDetails'
  | 'datasetsDepositedDetails'
  | 'codeDepositedDetails'
  | 'protocolsDepositedDetails'
  | 'labMaterialsRegisteredDetails';

interface QuickCheckQuestions {
  field: QuickCheck;
  question: string;
}

export const quickCheckQuestions: QuickCheckQuestions[] = [
  {
    field: 'acknowledgedGrantNumber',
    question:
      'Acknowledged ASAP and included your grant number in the funder acknowledgments',
  },
  {
    field: 'asapAffiliationIncluded',
    question:
      'Included ASAP as an affiliation within the author list for all ASAP-affiliated authors',
  },
  {
    field: 'manuscriptLicense',
    question:
      'Is this version of the manuscript licensed under CC-BY or CC0? (NC, ND, and SA modifier on a CC-BY license are not permitted)',
  },
  {
    field: 'datasetsDeposited',
    question: 'Deposited all newly generated datasets in a public repository',
  },
  {
    field: 'codeDeposited',
    question: 'Deposited all newly generated code and analysis scripts',
  },
  {
    field: 'protocolsDeposited',
    question: 'Deposited all newly generated protocols',
  },
  {
    field: 'labMaterialsRegistered',
    question: 'Registered all newly generated lab materials',
  },
];

export const asapFundingReason = [
  'projects',
  'method-or-resource',
  'pivot',
  'leadership',
] as const;

export type ASAPFundingReason = (typeof asapFundingReason)[number];

export const asapFundingReasons = [
  {
    field: 'projects',
    reason:
      'The manuscript contains projects that are listed as part of the team’s ASAP-funded proposal.',
  },
  {
    field: 'method-or-resource',
    reason:
      'The manuscript describes a method or resource that enables the team’s ASAP-funded proposal.',
  },
  {
    field: 'pivot',
    reason:
      'The manuscript resulted from a pivot that was made as part of the team’s ASAP-funded proposal.',
  },
  {
    field: 'leadership',
    reason:
      'The manuscript is a thought leadership piece (review, communication, letter) pertaining to knowledge gaps in the field that the ASAP-funded proposal was addressing.',
  },
];
