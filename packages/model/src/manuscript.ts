import { JSONSchemaType } from 'ajv';
import { AuthorAlgoliaResponse } from './authors';
import { UserResponse } from './user';

export const manuscriptTypes = [
  'Original Research',
  'Review / Op-Ed / Letter / Hot Topic',
] as const;
export type ManuscriptType = (typeof manuscriptTypes)[number];

export const manuscriptLifecycles = [
  'Draft Manuscript(prior to Publication)',
  'Preprint',
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
    lifecycle: 'Draft Manuscript(prior to Publication)',
    types: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
  },
  { lifecycle: 'Preprint', types: ['Original Research'] },
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

const manuscriptFileTypes = [
  'Manuscript File',
  'Key Resource Table',
  'Additional Files',
] as const;
export type ManuscriptFileType = (typeof manuscriptFileTypes)[number];

export type ManuscriptVersion = {
  type: ManuscriptType;
  lifecycle: ManuscriptLifecycle;
  preprintDoi?: string;
  publicationDoi?: string;
  requestingApcCoverage?: ApcCoverageOption;
  submitterName?: string;
  submissionDate?: Date;
  otherDetails?: string;
  manuscriptFile: ManuscriptFile;
  keyResourceTable?: ManuscriptFile;
  additionalFiles?: ManuscriptFile[];

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
  createdDate: string;
  publishedAt: string;
};

export const manuscriptFormFieldsMapping: Record<
  ManuscriptType,
  Record<
    ManuscriptLifecycle,
    Array<
      keyof Omit<ManuscriptVersion, 'createdBy' | 'createdDate' | 'publishedAt'>
    >
  >
> = {
  'Original Research': {
    'Draft Manuscript(prior to Publication)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
      'keyResourceTable',
    ],
    Preprint: [
      'preprintDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
      'keyResourceTable',
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
      'keyResourceTable',
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
      'keyResourceTable',
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
      'keyResourceTable',
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
      'keyResourceTable',
    ],
  },
  'Review / Op-Ed / Letter / Hot Topic': {
    'Draft Manuscript(prior to Publication)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
    ],
    Preprint: [],
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

export type ManuscriptPostInternalAuthor = {
  userId: string;
};

export type ManuscriptPostExternalAuthor = {
  externalAuthorId?: string;
  externalAuthorName: string;
  externalAuthorEmail: string;
};

export type ManuscriptPostAuthor =
  | ManuscriptPostInternalAuthor
  | ManuscriptPostExternalAuthor;

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
    submitterName?: ManuscriptVersion['submitterName'];
    submissionDate?: string;
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
    description: string;
    manuscriptFile: ManuscriptVersion['manuscriptFile'];
    keyResourceTable?: ManuscriptVersion['keyResourceTable'];
    additionalFiles?: ManuscriptVersion['additionalFiles'];

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
    firstAuthors: ManuscriptPostAuthor[];
    correspondingAuthor?: ManuscriptPostAuthor;
    additionalAuthors?: ManuscriptPostAuthor[];
  }[];
};

type MultiselectOption = {
  label: string;
  value: string;
  isFixed?: boolean;
};

export type AuthorSelectOption = {
  author?: AuthorAlgoliaResponse;
} & MultiselectOption;

export type AuthorEmailField = {
  id?: string;
  email: string;
  name: string;
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
    submitterName?: ManuscriptVersion['submitterName'];
    submissionDate?: ManuscriptVersion['submissionDate'];
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
    manuscriptFile: ManuscriptVersion['manuscriptFile'];
    keyResourceTable: ManuscriptVersion['keyResourceTable'];
    additionalFiles?: ManuscriptVersion['additionalFiles'] | [];
    description: string;

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
    firstAuthors: AuthorSelectOption[];
    firstAuthorsEmails: AuthorEmailField[];
    correspondingAuthor: AuthorSelectOption[];
    correspondingAuthorEmails: AuthorEmailField[];
    additionalAuthors: AuthorSelectOption[];
    additionalAuthorsEmails: AuthorEmailField[];
  }[];
};

export type ManuscriptCreateControllerDataObject = ManuscriptPostRequest & {
  userId: string;
};

export type ManuscriptCreateDataObject = Omit<
  ManuscriptPostRequest,
  'versions'
> & {
  userId: string;
  versions: (Omit<
    ManuscriptPostRequest['versions'][number],
    'firstAuthors' | 'correspondingAuthor' | 'additionalAuthors'
  > & {
    firstAuthors: string[];
    correspondingAuthor: string[];
    additionalAuthors: string[];
  })[];
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
            submitterName: { type: 'string', nullable: true },
            submissionDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },

            otherDetails: { type: 'string', nullable: true },
            description: { type: 'string' },
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
            keyResourceTable: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                filename: { type: 'string', nullable: true },
                url: { type: 'string', nullable: true },
              },
              nullable: true,
              required: ['id'],
            },
            additionalFiles: {
              type: 'array',
              nullable: true,
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  id: { type: 'string' },
                  filename: { type: 'string', nullable: true },
                  url: { type: 'string', nullable: true },
                },
                required: ['id'],
              },
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
            firstAuthors: {
              type: 'array',
              items: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      userId: { type: 'string' },
                    },
                    required: ['userId'],
                  },
                  {
                    type: 'object',
                    properties: {
                      externalAuthorId: { type: 'string', nullable: true },
                      externalAuthorName: { type: 'string' },
                      externalAuthorEmail: { type: 'string' },
                    },
                    required: ['externalAuthorName', 'externalAuthorEmail'],
                  },
                ],
              },
            },
            correspondingAuthor: {
              type: 'object',
              nullable: true,
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                  },
                  required: ['userId'],
                },
                {
                  type: 'object',
                  properties: {
                    externalAuthorId: { type: 'string', nullable: true },
                    externalAuthorName: { type: 'string' },
                    externalAuthorEmail: { type: 'string' },
                  },
                  required: ['externalAuthorName', 'externalAuthorEmail'],
                },
              ],
            },
            additionalAuthors: {
              type: 'array',
              nullable: true,

              items: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      userId: { type: 'string' },
                    },
                    required: ['userId'],
                  },
                  {
                    type: 'object',
                    properties: {
                      externalAuthorId: { type: 'string', nullable: true },
                      externalAuthorName: { type: 'string' },
                      externalAuthorEmail: { type: 'string' },
                    },
                    required: ['externalAuthorName', 'externalAuthorEmail'],
                  },
                ],
              },
            },
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
    question:
      'Deposited all newly generated code and analysis scripts in a public repository',
  },
  {
    field: 'protocolsDeposited',
    question: 'Deposited all newly generated protocols in a public repository',
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
