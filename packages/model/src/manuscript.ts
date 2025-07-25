import { JSONSchemaType } from 'ajv';
import { ascending, descending, SortingDirection } from './analytics';
import { AuthorAlgoliaResponse, AuthorResponse } from './authors';
import { ListResponse } from './common';
import { ComplianceReportDataObject } from './compliance-report';
import { ManuscriptDiscussion } from './discussion';
import { UserResponse } from './user';

export const manuscriptTypes = [
  'Original Research',
  'Review / Op-Ed / Letter / Hot Topic',
] as const;
export type ManuscriptType = (typeof manuscriptTypes)[number];

export const manuscriptLifecycles = [
  'Draft Manuscript (prior to Publication)',
  'Preprint',
  'Typeset proof',
  'Publication',
  'Publication with addendum or corrigendum',
  'Other',
] as const;
export type ManuscriptLifecycle = (typeof manuscriptLifecycles)[number];

export const manuscriptLifecycleRequiredURL: ManuscriptLifecycle[] = [
  'Preprint',
  'Publication',
  'Publication with addendum or corrigendum',
];

export const manuscriptTypeLifecycles: {
  lifecycle: ManuscriptLifecycle;
  types: ManuscriptType[];
}[] = [
  {
    lifecycle: 'Draft Manuscript (prior to Publication)',
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
  id: string;
  type: ManuscriptType;
  lifecycle: ManuscriptLifecycle;
  description: string;
  shortDescription: string;
  count: number;
  versionUID?: string;
  preprintDoi?: string;
  publicationDoi?: string;
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
  availabilityStatement?: string;

  acknowledgedGrantNumberDetails?: string;
  asapAffiliationIncludedDetails?: string;
  manuscriptLicenseDetails?: string;
  datasetsDepositedDetails?: string;
  codeDepositedDetails?: string;
  protocolsDepositedDetails?: string;
  labMaterialsRegisteredDetails?: string;
  availabilityStatementDetails?: string;

  teams: { displayName: string; id: string; inactiveSince?: string }[];
  labs: { name: string; id: string; labPi?: string; labPITeamIds?: string[] }[];

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
  updatedBy: Pick<
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
  complianceReport?: ComplianceReportDataObject;
  firstAuthors: AuthorResponse[];
  correspondingAuthor: AuthorResponse[];
  additionalAuthors: AuthorResponse[];
};

export const manuscriptFormFieldsMapping: Record<
  ManuscriptType,
  Record<
    ManuscriptLifecycle,
    Array<
      keyof Omit<
        ManuscriptVersion,
        | 'complianceReport'
        | 'count'
        | 'createdBy'
        | 'createdDate'
        | 'id'
        | 'publishedAt'
        | 'updatedBy'
        | 'firstAuthors'
        | 'correspondingAuthor'
        | 'additionalAuthors'
        | 'versionUID'
      >
    >
  >
> = {
  'Original Research': {
    'Draft Manuscript (prior to Publication)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
      'availabilityStatement',
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
      'availabilityStatement',
      'keyResourceTable',
    ],
    'Typeset proof': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
      'availabilityStatement',
      'keyResourceTable',
    ],
    Publication: [
      'preprintDoi',
      'publicationDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
      'availabilityStatement',
      'keyResourceTable',
    ],
    'Publication with addendum or corrigendum': [
      'preprintDoi',
      'publicationDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
      'availabilityStatement',
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
      'availabilityStatement',
      'keyResourceTable',
    ],
  },
  'Review / Op-Ed / Letter / Hot Topic': {
    'Draft Manuscript (prior to Publication)': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
    ],
    Preprint: [],
    'Typeset proof': [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
    ],
    Publication: [
      'publicationDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
    ],
    'Publication with addendum or corrigendum': [
      'publicationDoi',
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

export const manuscriptStatus = [
  'Waiting for Report',
  'Review Compliance Report',
  'Manuscript Resubmitted',
  'Submit Final Publication',
  'Addendum Required',
  'Compliant',
  'Closed (other)',
] as const;

export const statusButtonOptions = manuscriptStatus.filter(
  (status) =>
    !['Waiting for Report', 'Manuscript Resubmitted'].includes(status),
);

export type ManuscriptStatus = (typeof manuscriptStatus)[number];

export const isManuscriptStatus = (type: string): type is ManuscriptStatus =>
  (manuscriptStatus as ReadonlyArray<string>).includes(type);

export const manuscriptMapStatus = (
  status?: string | null,
): ManuscriptStatus | null => {
  if (status && isManuscriptStatus(status)) {
    return status;
  }

  return null;
};

export type ManuscriptAssignedUser = Pick<
  UserResponse,
  'id' | 'firstName' | 'lastName' | 'avatarUrl'
>;

export const apcCoverageRequestStatuses = [
  'notPaid',
  'paid',
  'declined',
] as const;

export type ApcCoverageRequestStatus =
  (typeof apcCoverageRequestStatuses)[number];

export type ManuscriptImpact = {
  id: string;
  name: string;
};

export type ManuscriptCategory = {
  id: string;
  name: string;
};

export type ManuscriptDataObject = {
  id: string;
  title: string;
  url?: string;
  status?: ManuscriptStatus;
  teamId: string;
  versions: ManuscriptVersion[];
  count: number;
  assignedUsers: ManuscriptAssignedUser[];
  discussions: ManuscriptDiscussion[];
  apcRequested?: boolean;
  apcAmountRequested?: number;
  apcCoverageRequestStatus?: ApcCoverageRequestStatus;
  apcAmountPaid?: number;
  declinedReason?: string;
  impact?: ManuscriptImpact;
  categories?: ManuscriptCategory[];
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

export type ManuscriptPostCreateRequest = Pick<
  ManuscriptDataObject,
  'title' | 'teamId' | 'url'
> & {
  eligibilityReasons: string[];
  impact: string;
  categories: string[];
  versions: {
    type: ManuscriptVersion['type'] | '';
    lifecycle: ManuscriptVersion['lifecycle'] | '';
    preprintDoi?: ManuscriptVersion['preprintDoi'];
    publicationDoi?: ManuscriptVersion['publicationDoi'] | '';
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
    description: string;
    shortDescription: string;
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
    availabilityStatement?: ManuscriptVersion['availabilityStatement'];

    acknowledgedGrantNumberDetails?: string;
    asapAffiliationIncludedDetails?: string;
    manuscriptLicenseDetails?: string;
    datasetsDepositedDetails?: string;
    codeDepositedDetails?: string;
    protocolsDepositedDetails?: string;
    labMaterialsRegisteredDetails?: string;
    availabilityStatementDetails?: string;

    teams: string[];
    labs?: string[];
    firstAuthors: ManuscriptPostAuthor[];
    correspondingAuthor?: ManuscriptPostAuthor;
    additionalAuthors?: ManuscriptPostAuthor[];
  }[];
  notificationList?: string;
};
export type ManuscriptPostResubmitRequest = Omit<
  ManuscriptPostCreateRequest,
  'eligibilityReasons'
>;

export type ManuscriptPostRequest =
  | ManuscriptPostCreateRequest
  | ManuscriptPostResubmitRequest;

export type ManuscriptUpdateAssignedUsers = {
  assignedUsers: string[];
};

export type ManuscriptUpdateAPCCoverageDetails = Pick<
  ManuscriptResponse,
  | 'apcRequested'
  | 'apcAmountRequested'
  | 'apcCoverageRequestStatus'
  | 'apcAmountPaid'
  | 'declinedReason'
>;

export type ManuscriptUpdateStatus = Pick<ManuscriptDataObject, 'status'> & {
  notificationList?: string;
};
export type ManuscriptUpdateContent = Partial<ManuscriptPostRequest>;
export type ManuscriptPutRequest =
  | ManuscriptUpdateAPCCoverageDetails
  | ManuscriptUpdateAssignedUsers
  | ManuscriptUpdateStatus
  | ManuscriptUpdateContent;

export type ManuscriptUpdateDataObject =
  | ManuscriptUpdateAPCCoverageDetails
  | ManuscriptUpdateAssignedUsers
  | ManuscriptUpdateStatus
  | Partial<
      Omit<ManuscriptPostRequest, 'versions'> & {
        versions: (Omit<
          ManuscriptPostRequest['versions'][number],
          'firstAuthors' | 'correspondingAuthor' | 'additionalAuthors'
        > & {
          firstAuthors: string[];
          correspondingAuthor: string[];
          additionalAuthors: string[];
        })[];
      }
    >;

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
  ManuscriptPostCreateRequest,
  'title' | 'teamId' | 'eligibilityReasons' | 'url'
> & {
  impact: MultiselectOption;
  categories: MultiselectOption[];
  versions: (Pick<
    ManuscriptPostRequest['versions'][number],
    | 'type'
    | 'lifecycle'
    | 'preprintDoi'
    | 'publicationDoi'
    | 'otherDetails'
    | 'description'
    | 'shortDescription'
    | 'acknowledgedGrantNumber'
    | 'asapAffiliationIncluded'
    | 'manuscriptLicense'
    | 'datasetsDeposited'
    | 'codeDeposited'
    | 'protocolsDeposited'
    | 'labMaterialsRegistered'
    | 'availabilityStatement'
    | 'acknowledgedGrantNumberDetails'
    | 'asapAffiliationIncludedDetails'
    | 'manuscriptLicenseDetails'
    | 'datasetsDepositedDetails'
    | 'codeDepositedDetails'
    | 'protocolsDepositedDetails'
    | 'labMaterialsRegisteredDetails'
    | 'availabilityStatementDetails'
  > & {
    manuscriptFile: ManuscriptVersion['manuscriptFile'] | null;
    keyResourceTable: ManuscriptVersion['keyResourceTable'] | null;
    additionalFiles?: ManuscriptVersion['additionalFiles'] | [];

    teams: MultiselectOption[];
    labs: MultiselectOption[];
    firstAuthors: AuthorSelectOption[];
    firstAuthorsEmails: AuthorEmailField[];
    correspondingAuthor: AuthorSelectOption[];
    correspondingAuthorEmails: AuthorEmailField[];
    additionalAuthors: AuthorSelectOption[];
    additionalAuthorsEmails: AuthorEmailField[];
  })[];
};

export type ManuscriptCreateControllerDataObject =
  ManuscriptPostCreateRequest & {
    userId: string;
    notificationList?: string;
  };

export type ManuscriptResubmitControllerDataObject = Omit<
  ManuscriptCreateControllerDataObject,
  'eligibilityReasons'
>;

export type ManuscriptCreateDataObject = Omit<
  ManuscriptPostCreateRequest,
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
  notificationList?: string;
};

export type ManuscriptResubmitDataObject = Omit<
  ManuscriptCreateDataObject,
  'eligibilityReasons'
>;

export const manuscriptVersionSchema = {
  type: 'object',
  properties: {
    type: { enum: manuscriptTypes, type: 'string' },
    lifecycle: { enum: manuscriptLifecycles, type: 'string' },
    preprintDoi: { type: 'string', nullable: true },
    publicationDoi: { type: 'string', nullable: true },

    otherDetails: { type: 'string', nullable: true },
    description: { type: 'string' },
    shortDescription: { type: 'string', nullable: true, maxLength: 250 },
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
    availabilityStatement: { type: 'string', nullable: true },
    acknowledgedGrantNumberDetails: { type: 'string', nullable: true },
    asapAffiliationIncludedDetails: { type: 'string', nullable: true },
    manuscriptLicenseDetails: { type: 'string', nullable: true },
    datasetsDepositedDetails: { type: 'string', nullable: true },
    codeDepositedDetails: { type: 'string', nullable: true },
    protocolsDepositedDetails: { type: 'string', nullable: true },
    labMaterialsRegisteredDetails: { type: 'string', nullable: true },
    availabilityStatementDetails: { type: 'string', nullable: true },

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
} as const;

export const manuscriptPostRequestSchema: JSONSchemaType<ManuscriptPostRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      url: { type: 'string', nullable: true },
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
        items: manuscriptVersionSchema,
      },
      notificationList: { type: 'string', nullable: true },
      impact: { type: 'string', nullable: true },
      categories: { type: 'array', items: { type: 'string' }, nullable: true },
    },
    required: ['title', 'teamId', 'versions'],
    additionalProperties: false,
  };

export const manuscriptPutRequestSchema: JSONSchemaType<ManuscriptPutRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string', nullable: true },
      url: { type: 'string', nullable: true },
      teamId: { type: 'string', nullable: true },
      assignedUsers: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      apcRequested: { type: 'boolean', nullable: true },
      apcAmountRequested: { type: 'number', nullable: true },
      apcAmountPaid: { type: 'number', nullable: true },
      declinedReason: { type: 'string', nullable: true },
      apcCoverageRequestStatus: {
        enum: apcCoverageRequestStatuses,
        type: 'string',
        nullable: true,
      },
      status: { enum: manuscriptStatus, type: 'string', nullable: true },
      versions: {
        type: 'array',
        maxItems: 1,
        items: manuscriptVersionSchema,
        nullable: true,
      },
      notificationList: { type: 'string', nullable: true },
      impact: { type: 'string', nullable: true },
      categories: { type: 'array', items: { type: 'string' }, nullable: true },
    },
    additionalProperties: false,
  };

export const questionChecksOptions = ['Yes', 'No', 'Not applicable'] as const;

export type QuestionChecksOption = (typeof questionChecksOptions)[number];

export type QuickCheck =
  | 'acknowledgedGrantNumber'
  | 'asapAffiliationIncluded'
  | 'manuscriptLicense'
  | 'datasetsDeposited'
  | 'codeDeposited'
  | 'protocolsDeposited'
  | 'labMaterialsRegistered'
  | 'availabilityStatement';

export type QuickCheckDetails =
  | 'acknowledgedGrantNumberDetails'
  | 'asapAffiliationIncludedDetails'
  | 'manuscriptLicenseDetails'
  | 'datasetsDepositedDetails'
  | 'codeDepositedDetails'
  | 'protocolsDepositedDetails'
  | 'labMaterialsRegisteredDetails'
  | 'availabilityStatementDetails';

interface QuickCheckQuestions {
  field: QuickCheck;
  question: string;
}

export type QuickCheckDetailsObject = Pick<
  ManuscriptPostRequest['versions'][number],
  | 'acknowledgedGrantNumberDetails'
  | 'asapAffiliationIncludedDetails'
  | 'availabilityStatementDetails'
  | 'codeDepositedDetails'
  | 'datasetsDepositedDetails'
  | 'labMaterialsRegisteredDetails'
  | 'manuscriptLicenseDetails'
  | 'protocolsDepositedDetails'
>;

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
  {
    field: 'availabilityStatement',
    question: 'Included an Availability Statement?',
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
      'The manuscript reports findings from your team’s ASAP-funded proposal.',
  },
  {
    field: 'method-or-resource',
    reason:
      'The manuscript reports a method or resource that enables your team’s ASAP-funded proposal.',
  },
  {
    field: 'pivot',
    reason:
      'The manuscript resulted from a pivot stemming from the findings of the ASAP-funded proposal.',
  },
  {
    field: 'leadership',
    reason:
      'The manuscript is a thought leadership piece (review, communication, letter) on the topic that the ASAP-funded proposal aims to address.',
  },
];

export type SortComplianceFields =
  | 'team'
  | 'id'
  | 'lastUpdated'
  | 'status'
  | 'apcCoverage';

export type ComplianceSortingDirection = {
  [key in SortComplianceFields]: SortingDirection;
};

export type SortCompliance =
  | 'team_asc'
  | 'team_desc'
  | 'id_asc'
  | 'id_desc'
  | 'last_updated_asc'
  | 'last_updated_desc'
  | 'status_asc'
  | 'status_desc'
  | 'apc_coverage_asc'
  | 'apc_coverage_desc';

export const complianceInitialSortingDirection = {
  team: ascending,
  id: descending,
  lastUpdated: descending,
  status: ascending,
  apcCoverage: ascending,
};

export type PartialManuscriptResponse = Pick<ManuscriptVersion, 'id'> &
  Pick<
    ManuscriptResponse,
    | 'status'
    | 'title'
    | 'apcRequested'
    | 'apcAmountRequested'
    | 'apcCoverageRequestStatus'
    | 'apcAmountPaid'
    | 'declinedReason'
  > & {
    lastUpdated: string;
    team: { id: string; displayName: string };
    assignedUsers: ManuscriptAssignedUser[];
    manuscriptId: string;
    teams: string;
  };

export type ListPartialManuscriptResponse =
  ListResponse<PartialManuscriptResponse>;

export const completedStatusOptions = {
  show: 'Show',
  hide: 'Hide',
};

export type CompletedStatusOption = keyof typeof completedStatusOptions;
export const DEFAULT_COMPLETED_STATUS: CompletedStatusOption = 'hide';

export const requestedAPCCoverageOptions = {
  all: 'Show all',
  apcNotRequested: 'Not Requested',
  apcRequested: 'Requested',
  paid: 'Requested: Paid',
  notPaid: 'Requested: Not Paid',
  declined: 'Requested: Declined',
};

export type RequestedAPCCoverageOption =
  keyof typeof requestedAPCCoverageOptions;

export const DEFAULT_REQUESTED_APC_COVERAGE: RequestedAPCCoverageOption = 'all';

export type ManuscriptError = {
  statusCode: number;
  response?: {
    message: string;
    data: {
      team: string;
      manuscriptId: string;
    };
  };
};

export type FileAction = 'upload' | 'download';

export const apcRequestedOptions = ['Requested', 'Not Requested'] as const;
export type APCRequestedOption = (typeof apcRequestedOptions)[number];

export const manuscriptNotificationAttachmentContent =
  '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Zz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL2cvaW1nLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczppbGx1c3RyYXRvcj0iaHR0cDovL25zLmFkb2JlLmNvbS9pbGx1c3RyYXRvci8xLjAvIgogICAgICAgICAgICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iCiAgICAgICAgICAgIHhtbG5zOnBkZng9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmeC8xLjMvIj4KICAgICAgICAgPGRjOmZvcm1hdD5KUEVHIGZpbGUgZm9ybWF0PC9kYzpmb3JtYXQ+CiAgICAgICAgIDxkYzp0aXRsZT4KICAgICAgICAgICAgPHJkZjpBbHQ+CiAgICAgICAgICAgICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+MTAyMDQ5LTAwN19BU0FQX0VtYWlsXzIwMjVfQWN0aXZlQ2FtcGFpZ25fSGVhZGVyc192MTwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpBbHQ+CiAgICAgICAgIDwvZGM6dGl0bGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgSWxsdXN0cmF0b3IgMjkuMiAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAyNS0wMS0yN1QxMzowMTo0NS0wNTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDI1LTAxLTI3VDE4OjAxOjQ1WjwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjUtMDEtMjdUMTM6MDE6NDUtMDU6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6VGh1bWJuYWlscz4KICAgICAgICAgICAgPHJkZjpBbHQ+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzp3aWR0aD4yNTY8L3htcEdJbWc6d2lkdGg+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmhlaWdodD4xNzI8L3htcEdJbWc6aGVpZ2h0PgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzpmb3JtYXQ+SlBFRzwveG1wR0ltZzpmb3JtYXQ+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOmltYWdlPi85ai80QUFRU2taSlJnQUJBZ0VBQUFBQUFBRC83UUFzVUdodmRHOXphRzl3SURNdU1BQTRRa2xOQSswQUFBQUFBQkFBQUFBQUFBRUEmI3hBO0FRQUFBQUFBQVFBQi8rNEFEa0ZrYjJKbEFHVEFBQUFBQWYvYkFJUUFCZ1FFQkFVRUJnVUZCZ2tHQlFZSkN3Z0dCZ2dMREFvS0N3b0smI3hBO0RCQU1EQXdNREF3UURBNFBFQThPREJNVEZCUVRFeHdiR3hzY0h4OGZIeDhmSHg4Zkh3RUhCd2NOREEwWUVCQVlHaFVSRlJvZkh4OGYmI3hBO0h4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zi84QUFFUWdBckFFQUF3RVImI3hBO0FBSVJBUU1SQWYvRUFhSUFBQUFIQVFFQkFRRUFBQUFBQUFBQUFBUUZBd0lHQVFBSENBa0tDd0VBQWdJREFRRUJBUUVBQUFBQUFBQUEmI3hBO0FRQUNBd1FGQmdjSUNRb0xFQUFDQVFNREFnUUNCZ2NEQkFJR0FuTUJBZ01SQkFBRklSSXhRVkVHRTJFaWNZRVVNcEdoQnhXeFFpUEImI3hBO1V0SGhNeFppOENSeWd2RWxRelJUa3FLeVkzUENOVVFuazZPek5oZFVaSFREMHVJSUpvTUpDaGdaaEpSRlJxUzBWdE5WS0JyeTQvUEUmI3hBOzFPVDBaWFdGbGFXMXhkWGw5V1oyaHBhbXRzYlc1dlkzUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8rQ2s1U1ZscGVZbVomI3hBO3FibkoyZW41S2pwS1dtcDZpcHFxdXNyYTZ2b1JBQUlDQVFJREJRVUVCUVlFQ0FNRGJRRUFBaEVEQkNFU01VRUZVUk5oSWdaeGdaRXkmI3hBO29iSHdGTUhSNFNOQ0ZWSmljdkV6SkRSRGdoYVNVeVdpWTdMQ0IzUFNOZUpFZ3hkVWt3Z0pDaGdaSmpaRkdpZGtkRlUzOHFPend5Z3AmI3hBOzArUHpoSlNrdE1UVTVQUmxkWVdWcGJYRjFlWDFSbFptZG9hV3ByYkcxdWIyUjFkbmQ0ZVhwN2ZIMStmM09FaFlhSGlJbUtpNHlOam8mI3hBOytEbEpXV2w1aVptcHVjblo2ZmtxT2twYWFucUttcXE2eXRycSt2L2FBQXdEQVFBQ0VRTVJBRDhBOVU0cTdGWFlxN0ZYWXE3RlhZcTcmI3hBO0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0YmI3hBO1hZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlgmI3hBO1lxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGV0krYi96RnN2TFdwUldNOW5KY1BMQ3M0ZEdVQUJuWmFiLzZtWStYVUNFcXB4czImI3hBO3BFRFZKRWZ6dzByL0FLdGsvd0R3YVl4MUFQUm9PdmozTmY4QUs4dEsvd0NyWlA4QThHbVh4Tm8vbEdQYzEveXZQU3YrclpQL0FNR20mI3hBO1hSeEVzZjVUajNGMy9LOU5KLzZ0ay84QXdhWmFOS1QxUi9La2U0dS81WHBwUC9Wcm4vNE5Nc0doSjZvL2xXUDgwdGY4cjAwbi9xMXomI3hBOy93REJwbGc3T2wzaGY1VmovTkxqK2V1ay93RFZybi80Tk1QOG1TN3d2OHF4L21sYWZ6NTBnZjhBU3J1UCtEVEgrVEpkNFQvS2tlNHImI3hBO0QrZm1rRC9wVlhIL0FBYVkvd0FtUzd3eUhhVWU0cmYrVi82UC93QldxNC80Tk1mNU1sM2htTmVPNXIvb1lIUi8rclRjZjhqRXdmeWImI3hBO0x2RFlOV0QwYS82R0MwZi9BS3ROeC95TVRCL0owdTlzR2NIbzcvb1lQUi8rclRjZjhqRXgvaytYZTJDZHUvNkdEMGYvQUt0TngveU0mI3hBO1RJL2tKZDdhSTI3L0FLR0QwZjhBNnROeC93QWpFd2ZrVDN0b3dFdlRmMHRwWC9MYkIveU5UK3VhL2lIZTQzR085cjlMNlYveTJ3ZjgmI3hBO2pVL3JodGVPUGU3OUw2VC9BTXRzSC9JMVA2NFVlSkh2RHYwdnBQOEF5MndmOGpVL3JoNFN2aVI3dzc5TDZUL3kyd2Y4alUvcmg0RDMmI3hBO0w0a2U4Ty9TK2svOHRzSC9BQ05UK3VQQkx1WHhJOTRkK2w5Si93Q1cyRC9rYW45Y1BoeTdpdmlSN3c3OU1hVC9BTXR0di95TlQrdVAmI3hBO2h5N2l2aVI3dzc5TTZSL3kzVy8vQUNOVCt1UGh5N2l2aVI3dzErbWRILzVicmY4QTVHcC9YSHc1ZHhUeHg3M2ZwclIvK1c2My93Q1ImI3hBO3FmMXg4T1hjVjRoM3UvVFdqLzhBTGZiL0FQSTFQNjQrSEx1S2JEdjAxby8vQUMzMi93RHlOVCt1RGdsM0p0MzZhMGIvQUpiN2Yva2EmI3hBO245Y2VDWGNydjAxbzMvTGZiLzhBSTFQNjQ4QjdrMFVaa1VQRmZ6ci9BT1VwdGY4QW1Cai9BT1QwdWF6V2YzZzkzNjNWNjc2aDdubnAmI3hBO3lXSjE1V25NL0cxbG81blkyQmF6TGd3TFdaVVVPeStLRnB5YUZKOExZRkZzVzJLbWNEZEZhY0JjaUMzSWx5b05ISWx5b05aQXVYQjImI3hBO1JMbHdUNXM0UEU4ZEpZYzJHSnFLMDVzTWJXVTc4dStVcnZYVmRvYjJ5dEFyaU1mVzV2VExPYVVDcUF6SHI0WmxDZkMyWXNCbjFBOTUmI3hBO1JWcitYZm1DZldML0FFdGpCYnlhYWdrdTdpYVRqQ3FNT1N0eUFZMEs3OVBuVE1nWjRnQTk2UnBKbVJqc09IbXBqeUxxSDZVT250ZlcmI3hBO0NMNkMzUzNyM0FXM2FKenhWbGNpcHFmYkw0NmdjTjBmbHV4L0xIaTRianl1NzJSTS93Q1dtdlJhaWRQTnhadE85dWJxMUltSVc0UWQmI3hBO1JFektLc1A4cWc5OGxIV1E0Ym84Njl5VG9waVhEWXVySG43bERYL3kyOHlhTG9xNnZkZWk5dDhJbVdKeXp4RmlGSE1GUXYyangrRW4mI3hBO2ZKWXRaQ2N1RWMyV1RSemhIaVBKS0c4bmVZamF4M1MyaGFHVUt5TUdYN01nVXF4MzJCOVJSdjMyNjVaNDhMcTBSd3pxNlFzL2xqWEkmI3hBO1ZEeldwamlMUm9aWFpWUlhtK3dyTVNBcDlqMDY5TVBqUlBWdEdPUTZOdDVTOHhoV1lXTWpCWkdoYWdGUTZyejRzT3ExWGRhOWUyUjgmI3hBO2VIZTVFY2N1NUxyL0FFeS9zSFJieUI0RElDeWN4U29WaWhwOG1VZzRSTVM1T1JFRUlVNGx5WU5aRXVYQjJRY3VEN0l6bm5BZUsvblgmI3hBOy93QXBUYS84d01mL0FDZWx6V2F6KzhIdS9XNnZYZlVQYzg5T1N4T3ZMMExRdkxINVgzajJ0akxyTnpjYWxkY1ZWWTBNU0IyQW9vckcmI3hBOzYxcWY1am1mQnk4ZUhBYUJrYktYM1g1ZGVuNTlpOHRKZEg2dE92ckpjTUJ6RVBFc1JRYkZ2Z0kvSE1xTTZGdE10Sis5NExUalZ2SVgmI3hBO2tTMHU3blN2cmw5YmFuQkEwOE0xeDZZZ21vbk9pdHdVTjRiRVpkanl6NTdVMlpkTGlpVEc1Q1ZkZVRHL0srbCtRSmJINno1aTFhZTMmI3hBO3VDNVZiU0NOdGdLVVlzRWxxRDlHWmM1WkFhaUhHd1F3a1hPUkJUanpYNUY4cjZGSnBPcGk1dVo5QXZtNHpoU3BtQVpPY2JSbml1eDcmI3hBOzFHT0RVem5jYUhFRzNVYVhIajRaV1RBL05OLytWUWVYcmZWcFByMm9UUjZhNEgxYU04VWtEOVdEeU1wVXFCM1VmTWp2WCtmbVk3RDEmI3hBO04zOG5RRXZVZlN4WDh6UHkvZzhyeVcxeFl6UE5ZWFpaQUphRjBrWGVoSUNnZ2c3YmRzeXRIcWpsc0htR2pWNlFZaUNPUlFDL2w1ZXkmI3hBOzJrTWtWeXJUVGkyVkVJb29sdUMzS0ptREdoakhBdHQzNlpJNm9BOHUvd0N4TWRNYStTRy93QmU4SjVQMGhhTkZid3l6eVNvWmlnV0MmI3hBO1V4dFdzWWI5aHlPSVBUM3duVWp1TFpIQWU4SWU0OGxYbG5xRmhaYWhjUnhTM3Blc1VJZWFXTlVKSEpsQ3F0SHA4Tkc5elRFYWdFRWcmI3hBO2NtNFlpQ0FVVlovbHJxbDQ4aVJYVnVraWNXL2ZFb2lvUktUemtBWk9hK2pRaEN3RmQyRkRsY3RVQjBjbUdNcU5sK1hPclhzMFVVTjMmI3hBO2Fmdml3RHMwd1ZmVDlYMUM1RVI0QlRidUt0MS9acmpMVXhIUXQ4QXhlZUZvWnBJV0lMUnNVWXFhZ2xUVFkrR1czYmxRV1pFdVhCUG0mI3hBO3pnOFR4MGxoellZbW9yVG13eHRaWjU1TDFqeVZwK2dTTmZPa0d0cmNDUVN5V24xcHpFdkU4SXVRNEp5b1JVa1VPWEdNaWR1VG1hZkomI3hBO2lqRGY2cjdyVHVmemQ1WS94VmY2eFllWVhzNUxoTFlJeldrc2tETEVDc2tjaVU1dFVCU0crR20rV1J4UzRRREcvaTJ5MUVQRU1venEmI3hBOzY2YkxKZk1uNVlYUG1MVUxvckZGenRVanRMdVcwYWFEMTZ1WGtGdnhyVVZUcUJXaCttMk9MTUlBZWZmK2xCemFjeko4dWRiWDdreDAmI3hBOy9YdEExcnpoNWVtMHk5YVc1dHJTYUNXSDBEQ0YvY3NlWFRnTi93QmxRUjc1R1dLY01jaEliRTkvbTJReXdubGdZbmNDdVZkRWs4NismI3hBO2NQS3phQnFkcHBsMUxlYWpxelJMY0t5eXBIRUlXQko0eUFMeVBHaEsvd0FNdjArbnljWU1oUWkxWjlSajRDSW16SmlQK0lORFNGSWsmI3hBO2sxSkVhTDA3bEVsQVVzS0htb1pucHlkZVREMzI5OHJ3cFgvQzBSeVI4MU5OZjBCSm5nTGFqSnAwc2tVakZwQjY2R0ozUEpLUHhMY08mI3hBO0NpdmZmc0tnNHBWZnB0dWpPUG5UZHpyM2xSNG9rai9TcUZGUEkrc0tjcS9hKzNUY2RhQWIxeUl4ei9vdDRuSHpTdldkUTBDNnRXUzImI3hBO0Y2OTFISi9vOHQwNnlmdWpVc0dvZGpYcFQzeVVJeUIzcHVCQ1JITEM1RUdzaVhMZzdJT1hCOWtaenpnUEZmenIvd0NVcHRmK1lHUC8mI3hBO0FKUFM1ck5aL2VEM2ZyZFhydnFIdVlKWXBieVgxdWx5M0MyZVZGbmZ3UXNBeCtnWkxFNElxOTN2ZHhvMGVtWFdsdm90dnBsbHBBa1QmI3hBOzY1Y1NJUFdia3lyR3NjbERWbjViRW10ZStiRU80bGo0U09FUkVVazgzZVdMeTg4KzZmZlIzd3NHbWdNVmpMR3c5VVhFU3U0cXBIMk8mI3hBO3g4ZW1YUWxRY2ZVWVNjb04xM2U5T05QWFY3alE3NkR6N2JXWXRJUUtYUEplTWlVUEoyQSt3UnRRaWg5c2RnUndjMjZIRVlFWmdLU2ImI3hBO3luNWYwMCtSWWJ6eS9hMlZ4cThnUEs2dmtEOFg1L0dHTzVYaXZRZkk1Zmt5SHhLa1R3K1RqNmZERTRiZ0ltWG0zK1ptbVhPcWVScksmI3hBOzVobnQzU3lDWE04cU54aWNDSXFmUm9ONnNmaEdUMGN4SEtRYjNYWFFNc0lJSTIvR3pKdGYwVnRWdEpMQ1BqRVoxWldrQ0tBRklwVWomI3hBO2RqVGZma042ZGVveDhXVGhOdVZteGNZNFE4Mi9ONmZUTk8wYlIvSzluTzF4SlpFeXpGMzlTUlFGNHB6UFl0eUo0OWg0Q21iSFFpVXAmI3hBO1N5SHE2L1hHTVl4eGczVEdsdHZMRVMybHhCcTBrVjFGNlByK2xJVkltWDRwNWxMcWEwNUtxQWRkejJPWkJNellJMi9GTlVSQVVRVksmI3hBO2JUdkxsdzYzRTJ1dk05eUE4NWQrTEtXVnl5dlZXSitJTFdpN0E3Qm0yeDRwamJoNU5vakU3Mm8yMDJpNnBaYVpaNmpxTXNOeERESzcmI3hBO1hUeXNVaVBOMFZPSjVnbmlzWm9PSHdqN1JxQW9rSlJKSURkQWdnV1ZkdE84aXJFZ2oxS1VCRnVGWWlTa2hNVXNucE1OaW43Nk9uUWImI3hBO0QzTlREaXlkM2QrUGc1RVJGRGZvZnlwRWswcDF4MmFDSDFGaFEwZVZ3ckhnakJXVlN6YmpkcURyOFRVVjQ1L3pXK0lTZnpEWjZSYlQmI3hBO3hEVFp4T2hEQ1FxMVJWSEtxd0c5T2FBTlRrVFd1dzJ5VUNUemNxQ1U1SXVYQjc4ZnlRMG8vd0RTem4vNEJNNUtPakE2dWhPaEhlMGYmI3hBO3lPMHIvcTV6L3dEQUpsOGNWTVQyZkh2YS93Q1ZHNlYvMWM1LytBVEw0eXBqL0pzZTh0ZjhxTTBuL3E1ei93REFKbDBkUVIwUi9Ka2UmI3hBOzh1LzVVWHBQL1Ywbi93Q0FUTFJyU09pUDVMajNsMy9LaTlKLzZ1ay8vQUpreDJoSWRFZnlWSCtjVWZvLzVVblJwbm4welhMbTJsa1gmI3hBO2c3ckZFeEsxclQ0ZzJESnJ1TVZLSUxaajdQNERjWkVJVy84QXlXczlRdTVidTcxaTRrdUpqeWtrOU9NVk5LZEZvTWxIdEV4RkNJcGomI3hBO0xzMEUyWkcwS2Z5RTBnLzlMVzQvNEJNbC9LY3U0Skhac2U4clQrUU9qLzhBVjF1UCtBVEgrVTVkd1pqUVJIVm8vd0RPUCtqL0FQVjImI3hBO3VQOEFrV21EK1VwZHdaalJnZFZ2L1F2dWovOEFWMnVQK1JhWS93QXBTN2cyRFRnZFhmOEFRdnVqL3dEVjJ1UCtSYVlQNVJsM05vaFQmI3hBO3YraGZOSC82dTF4L3lMVEIrZmwzTm9sVHYraGZOSC82dTF4L3lMVEkvbmozTm96a1BWOHdXaDRyK2RmL0FDbE5yL3pBeC84QUo2WE4mI3hBO1pyUDd3ZTc5YnE5ZDlROXp6MDVMRTY4dWFTUmxDc3hLcjlsU1RRZkxNL0cxbGE4anUzSjJMTjRrMU9aMk5nVzVKcG5GSGRtQTZCaVQmI3hBOyt2TXVERWxhSGRWS2hpRmI3UUIyUHp6S2l4UkduSlp6M2tFR29YVDIxaVdQcXpLcGtLQ2hPeUE5emxwc0N3TEtZQUU3bWd6Nzh5L00mI3hBOy9sTHpCWndYV25haEt1bzJYSVJRK2pJb2xFcklHQmMwNDhRQ2ZmcG1IbzhPVEdTQ05pN0hXNThlVUF4UHFIazh3Y2ttcDY1c25YaFImI3hBO2JGdGlwbkEzUlduQVhJZ3R5SmNxRFJ5SmNxRFdRTGx3ZGtTNWNIMlJuUE92ZGlyc1ZkaXJzVmRpcnNWZGlyc1ZkaXJzVmRpcnNWZGkmI3hBO3JzVmRpcnluODEvTEd2NnI1aHQ3alRyR1M1aFMwU05wRUFJRENXUWtkZkJobUJxY1VwVEJBNk92MWVLVXBiRG93by9sL3dDYy93RHEmI3hBOzB6L2NQNjRjZU9RNk9FZE5rN2xwL0wvenAvMWFKL3VIOWN6SUNtQjB1VCthdFA1ZmVkUCtyUlA5dy9ybVhDWURBNlRML05MditWZmUmI3hBO2RQOEFxMFQvQUhEK3VaVWMwZTlqK1V5L3pTMS95cjN6cC8xYUovdUg5Y3lJNmlIZWo4bmwvbWwzL0t2Zk92OEExYUovdUg5Y3VHcXgmI3hBOy93QTRJL0o1ZjVwYVA1ZStkZjhBcTBUL0FIRCt1Uy9ONHY1d1IrVHkvd0EwcVRmbDM1M1AvU251UHVIOWNQNXZGL09ETWFUTC9OS20mI3hBOzM1YytlUDhBcXpYSDNEK3VQNXZGL09EWU5May9tbFlmeTM4OC93RFZtdVB1SDljSDV2Ri9PRGRIVDVPNWFmeTI4OWY5V1c0KzRmMXcmI3hBO2Ztc2Y4NE4wY00rNWIveXJiejMvQU5XVzQrNGYxeUoxV1A4QW5PUkhITHVhUDVhK2UvOEFxeTNIM0QrdUQ4emo3M0lnQzcvbFd2bnYmI3hBOy9xeTNIM0QrdVJPcHg5N2t3SWQveXJYejMvMVpiajdoL1hJL21JZDdreHlSNzMxRm1rY0oyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXgmI3hBO1YyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYmI3hBOzJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjImI3hBO0t1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMksmI3hBO3V4VjJLdXhWMkt1eFYyS3V4VjJLdXhWMkt1eFYyS3NKOHdmbS93Q1VORjFDVFQzTnhlM01KS3ppMFJYVkdIVlN6dkdDUjNwV21aV1AmI3hBO1NUa0w1TXVFcTdmbWw1WEhsNkxYVitzUGFUVE5iSkdzZjczMVZYbVVvV0M5T254WUJwSjhYRDFheklCTDV2enU4bHgyMXROUzZrZTQmI3hBO0JMVzZSb1pJZ0dLL3ZhdUZGZU5RQXhOTXNHZ3lFbmsxUzFFUXJYdjV4K1ViTzdqdHBGdW1aeEd6dXNRNG9KRkRBdHlaVHNHMzRnNHgmI3hBOzBHUWk5bXVlc2hFMGJkWS9uSDVRdTlTanNWRnpGNnJoSTdtV05WaUpKb0RVT1hBUHV2enhsMmZrRWIyWXgxK015cmRtR29haERZeEomI3hBO0pJcnlHUnhIRkZFcGQyWWd0UUFleWs1aE9hZ3BmTldoeFI4amNCbkFEUEF2OTZnTVRURG5HYU12d0wzR0dsVjMxN1IwbmloYThpRFMmI3hBO3MwYUhtdkgxRUtLWTYxKzNXUWZEZ1Zhdm1QeSs4WmtYVXJZb0tua0pVNktRRDM4U01hVnkrWWRIYTRhRDYxR3JKenF6c3FyV0pRNzAmI3hBO0xFVm9wNWJkc2FWRldtb1dONEpEYVhFYzRpY3h5bU5nM0Z4MVUwNzRxcjRxN0ZYWXE3RlhZcTdGWGwzblc2VFV2ekowN3k3ckY0OW4mI3hBO29IMVl6ZW1zbm9yTkt3ZW5Kd1IzV2dyNGUrWjJFY09NeWlMazJBZW0wRjVoMGlMVHRKOHRXOEhtQ2E3WmJxU0w5SnhTbmhWWmZVVTAmI3hBO0R5S0RFVFRjOXZveTNGTzVTSmowNU9MbFdlZlBKemVYZktsM2NwcXQxY2w3MUh0ZWNyZ2haQUF3a29hU05WYThxWlBTNS9FeUFVT1QmI3hBO2lhckh3d0p2cWp0RHR6bzM1b1dsaGFYYzh0dGYyUHJYUW5sYVV2SXlNMVNUM3FnT1J5SGp3RWtDd1dHTWNHY0FFMFF5Q1JvWlh2NFkmI3hBOzlmVzJJdXJqMTBjT3JFMUxCS3U5UDNRRlAzWUh3Z1Z6V096VllSUEZkeU0zbWVJMVhpSTZJYUNLWWxqUXRUWUVvZm9yaWxCelRTeFEmI3hBO3gzcitaU3l4TThDdjZaWWVzRTVWWlFhRUUyN1U4YTdkY1VKL3AyczZiYlJ0RGQ2ekZkTzhyK2xLNVJCeEpKQ0JoUlc0MDY0cFRDMjEmI3hBO2JUYm00TnZiM0NTeWhCSnhSZ2FvZTRwOHg5NHdLaThWZGlyc1ZkaXJzVlVOUU00c0xrMjlUY0NKekNCdWVmRThhZlRoanpTSGpYNUQmI3hBOzNta21YVzdXK2VNWHQyc2RCTVJ5a2orUDFGQlk3N3NPUXpZNjBIWWprMjV1Yk05WjAzeTVwbjViYXRaYUMwYjJNU3VHOU9RVGZ2UzYmI3hBO2xsWmo2bFc2Q2h5akhLVXNvTXVialQ1RkIrVC9BQ2o1YzEzeU1ZTGkzb2J5UU5jWEtpTkp5MFpCVTgxQldsT2xOdUoyNjVQTm5uREomI3hBO1k2TmNjY1pSb3BCK2RrRUZyZStXNFZIR0NDTjBGZXlJMFlGZm96SjdPSklrNGV2RkdMZjU3UlJ4MzJqTWloVzlLVmFxS0hpckp4RzMmI3hBO1lWTk1QWmgyazFkcGplTDB6elJjV052cHl6M2p6UnJIS3BpbXQyUkpFY3F3NUJwQ0VId2xnYTVxQTdoSW9kTzhsVHZ6TjdLSnBZMFAmI3hBO296U2t5SUo0ZUpxSEROeVpYRFBVbmZmRkNzdW1lVDU1VzQ2aXplck93ZU1TcUE3VlJ5aFBIa3lreEp2WGZ4M3hTaDRMVHlQYlcwaVEmI3hBOzM4a2l5aU9PUnc0ZGdnQ0ZLMVhkZUVTTFNocUtWNjRvWDN0cDVSZ3U0ZFB1R25jdERiR0hjR01wUE5IQWxHMiswWXZpSDh2S21LVVYmI3hBO29tcGVUZExhYUN3dVZFY29lNWtuTzZBTFVsUzRBK3lLa1Y3ZDhWVFYvTkhsNUpIamEvaER4L2JYbDBvNGorL21hVXdVcUwwL1VyUy8mI3hBO2hNdHMvSlZQRngzVnFBOFQyclE0cWljVmRpcnNWZGlxVjYzNVc4djY1NmY2V3NZcnN3MTlKbkJETFhjZ01wQnA3WlpETEtQSXB0RDMmI3hBO1BrZnlsY3d3UXphVmJ0RGJLVWdqQzhWVlNha1VVanFkemtobm1PUllHSVBORTZsNVowRFU3ZTN0Nyt4aXVJYlVVdDQzQm9nb0JSYWUmI3hBO3dHUmhtbEUyRHpSUEhHV3hDakY1TjhyeFhrTjVIcHNLWFZ2NllobEFJWmZTVUtsTi93QmtLQmtqcUprVmV6RDh2QzdyZEIzMm4zMHQmI3hBOzJ3WFFMT2FNdEwrL2xsQUpWaWV3UmpWK2JFNVUzS05yWWFuOVlTWnZMbGxBMHNUQ1ovV1htcGtxV2pQRkNDQ1R2UTRxMWNXdXV4d04mI3hBO0NubDJ4dVl3QzRWWmxSU3hhUWNRcnFkd2ovYXFLa25wbGtSR3R6dTE1RElEMGkwNnQ5QzBwb0lHbjA2M2ptVmVUUmhWZFVkdmljS2EmI3hBO0N2eEhyVGZLbVk1Ym9xRFRiQ0NSWkliZEk1RVgwMVpWQUlUK1hidGlsRVlxN0ZYWXE3RlhZcTdGV0VhdCtUbmtyVXRRbHZuaW10NUomI3hBO21MeXBieWNZeXhOU2VKRFVyN1psUTFjNGltUmtVZk4rVy9sU1RSb2RGUzJlRFQ0WlJjZW5ISVI2a3RPUEtRbmx6LzJXUkdwbUpjWFYmI3hBO3JNUVVWNVo4azZKNWNsdVpkTjlibmRVOWIxWkRKWGlTYWl2ZmZJNWM4c2xYMFJIR0k4a0ZyMzVaK1Y5YzFPWFVyOUptdXBnb2NyS3kmI3hBO3I4Q2hSUmUyd3l6RnJKd2pRNU5XVFN3bWJLM1VmeXU4cTZnYmMzS1RzYldCTGFLa3JmWWpGRnI0bjN3dzF1U04xMVlUMFdPVlgwVEsmI3hBOzVzZkwrbDZOWjJONlNOUGdraml0eEtXZXJra0lHb0RYcjMyekhuTXlKSjZ1UkNBaUFCeUNRc3Y1Ykk5eWtrcjE1cERjbHZyUEVQSFImI3hBO0FHYWxOL1Q2azc5ZXUrUjNaTFVrL0xXRW9WbGVNeHlHNFFjYm9ic3l0c0N1NEJDai9NNDdxbU1keDVTanZvWTRIbWtsdWhIS0lsTW8mI3hBO2pWVGJraVZsWXFnUG94amwrMTAyM3gzU2c1L01QNWFYUHBTeTNpUyttdHNZVHhtSkF0T2NzUkZGNnFKR3I5eHkyV0NjUlpEUlBVUWkmI3hBO2FKM1RleThuK1dQcU1TUVFlcGFTS3JyVjNJZGVTU0xXcDMrd3YwZk01VmJjTjFXMjhuNkRiVFJTd3dzcGhDQ05mVWNxREd5c0g0ay8mI3hBO2EvZHJVOThiU2o5TzBxeTA1SkVzNC9UU1Z2VWRha2puUUF0UTl6VGZ4d0tpOFZkaXJzVmRpcnNWZGlyc1ZkaXJzVmRpcnNWZGlyc1YmI3hBO2RpcnNWZGlyc1ZkaXJzVmRpcnNWZGlyc1ZkaXF5YUNDZE9FMGF5b0NHQ3VvWVZHNE5ENFlxb0pwT21SeFNSSmF4cWt4WXlnS1BpTGsmI3hBO2xxbnIrMGNWV1JhSm84VVVjU1dNQWppWGhHcGpVMFVkdHg3WXFpUmEyd0NnUXBSQlJCeEd3QUswSGg4SnBpcUZtMFBScG9EQTlsRDYmI3hBO1RHcFVJcTcxQi9aQThCa3VNOTdDV09KNWhIWkZtN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0YmI3hBO1hZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlgmI3hBO1lxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFkmI3hBO3E3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXEmI3hBOzdGWFlxN0ZYWXE3RlhZcTdGVWgxTHo1NVEwMjZOcGVhbkVsd3A0dkdvZVFxZkJ2VFZndjA1YU1NeUxwb25xY2NUUkxwUFBmbE5HZ1UmI3hBO2FqSEtiaFMwWWlEU0VLb0pKWUlDVjZkOGo0Y3U1QjFXUGJmbXF3ZWN2TE0rbnlhaEhxRVp0WVNGa1lobFlFOUJ3WUI5KzIyUklJU04mI3hBO1RqTWVLOWxiU3ZNdWg2c1pCWVhhek5FT1RxUXlFRHhvNFUwOThDY2VlRS9wTFZsNW8wQyt2UHFkcmVMTGNiMFFCZ0RRVlBGaUFyZlEmI3hBO2NpSkJFTlRqa2FCM1JOeHFscEJjaTJjdTB4VVNNc2NidUZRa3FHY3FDRkJJUFh3UGhrbTlUYlh0SVdDT1pycEZqazlQcVFDb2xISkMmI3hBOzQvWkJIampTb2czOW1IVkJLck96S25GU0dJTGdzdGFkS2hjVlFzWG1EU1pMdDdReituTWhjVWtWa1Z2VGYwMjR1d0N0UnpUWTQwcXQmI3hBO0pxMm5SelBDMHkrcEdoa2NEZWdVMEkycjhWUjlucmlxb05Rc1BqLzBtTDkyUUpQalg0U3hvQTIrMVR0dmlyUjFIVDFyVzVpSEYvVGEmI3hBO3Jycy84cDM2KzJLcjdhN3Q3bFEwVGhqeFYyUTdPb2NjbDVLZmlXbzhSaXFyaXJzVmRpcnNWZWVlZDljdnJmemhZNmJlYWpjYVJvRXQmI3hBO3E4cHU3YlpubUhMWXVBNW9wNDdVNysrWmVHQU1DUUxsYmdhaklSa0FKTVkwZ3ROYnpWY2VTcnJYdFIxTytodTdhdjFKQVZpUjRrNDAmI3hBO2QwQy9GeUpZYitHUXljSWxRYW8rSWNSbVNiSEpDNkg1bzh4VGFoWlg4MnArcXR6ZEpCTFlFMCtGaUFTc1lIR2xEMThjeDViTk9QVVomI3hBO0RJU011WnFtWjZKUHFVbXA2aWpQZkphR0wvUnBiNk1xQTY3Rnh5VkFBZVd5Z2RqV20yUWp6YzdCS1hHZnE0Zk5RMDZIWFdzb21UVlkmI3hBO1dqbVNpc1paR2FScUVLeVBLcElxNXJzdjRDaHNjdEdFYXhJODhGeHFWdUpmVEhwaU55cktLeDhtWUtGSUh3TlRldTlLNHFwWEM2M0gmI3hBO1Bib05YaFZQV1kyd2RoV1dLTk9ESzdDTUF0WGYySnJ2UVlxcUt2bWFLTUkrcDJvWnZVOU5uSVBSbENqZEFUeFVFSGZxZDY0cWk3RWEmI3hBO2tkUkRTWDhNOFRjaTBTc3BQQW9wam9vVVVveGJldTYwclhGS2NZRmRpcnNWZGlyc1ZVN2xabXQ1VmhiaE15TUkzUFppTmo5K0VjMEgmI3hBO2s4TThrYWhwT2dIekJZZVpMSm52cEZFSVZvL1dZdU9ZYU91OU9aSU5hME9iUFVBeW94T3pwY0U0dzRoTWJzdS9LSHl6Y1cxbGRhaHEmI3hBO05tcUdka0ZrWm94Nm9WUXdkaHlISUszSWZPbVltb25ab09Ub01KQUprUGN4VFZJTGNlYjlUZ0tCWUJjeURnZ0d5OGo5bFFSMCtSeW8mI3hBOzhuQnlnZUtSMHRrR2kybW42YjUzc0k5S3VXdUVkU1o0K3ZwbG8yTFI4aHMxUDg5OHBQTnV4UmpETU9FMm4wUzZ4ZWVhTFcvbDBtUzImI3hBO3Q3WWlLMlVoUUZScWgza1lIcUFUUlJ0L0dHOThuSUhITEtKR05BSnpxMW5ZM09xcEc5eEtzOGl3RjRJNFRLT01Vck5FNVlLM3BWWm0mI3hBO0JKSXFLK0dYT3lTKzM4b2FURmNKTERxUU1vNHJiZ2lGdmpVSUdxS1ZlcGlHeDZZMmhWdE5GMGF5djdXZE5UYVV3eFJ4d1FGaEpWSWcmI3hBO3NRb0Y5K3RCNDRxcjNIbHpTYm1DNWhqdVJIUGVUU2VyY1JsUFVZT3hkb2E5YUN2UWVHKzIyTnBTODZINWVrdkpMZGIxb3J5TVhSWjImI3hBO2pLQmhQSS9ySGs0Q1B4RTNDb08yMktFYi9oM1NraUxDOVdNSk16UE9QVERCek5KTlFPZnNzUFdLL0w1bkcxVUlmS0dqSkxjbjY2SkcmI3hBO2xTVWNUNlh3STRlaCtFQ3BVeWs4ajdZMnFkNmJiV2tkM2VYRnZjcktibGxkNGtLOEY2MGFpOTJydWUvejN3SlRERlhZcTdGWFlxOHgmI3hBOzgyK1hkUXUvUFV0L2M2ZGZTYVlMVllvTGpTNUY5VjNGRCs4OVJnRkFQSVVBOERtYmp5QVk2QkYzMWRkbnhFNUxJTlYwYjAvUmZOMXQmI3hBOzVWMW0ydTRidTRTK1pZdE1zNVpGbW1pU3JIbElhZ0tPUEVHbmZzTXB5U2lUc3dqanlESElHemZJSjE1TThsYVhiMjlycUZ6WnpRNmwmI3hBO0NBSGpuSTRpVlJ2SXFnbnYwcmxKNXR1bTBzUUJJZzhUTXBJMGtqYU54eVJ3VlpUM0IySXdPZWt5ZVQ5QlZsYjBDV1dOb2d6T3pIZzYmI3hBO2xUdVQ0TWYxOWNOcXFKNVgwYU1LRWlaUXRPSUR0dFIvVUJHL1hsamFxNjZIcGdoaWhNSVpJVmRJdVcvRlpTR2NDdlFHbmJ0dDB3S2gmI3hBO1U4cWFYSGVtNVFNcXNuRjRhMUJJazlVTnlOWEJEZUI3RERhcTFoNWEwaXhkSkxlSWlTTnpJcnN6TTNKa01acVNmNVRqYXBuZ1YyS3UmI3hBO3hWMkt1eFZBYS9kVzlwb2QvYzNMeVJ3Ulc4clN2RC9lQmVCcVUveXZESjR3VElBTU1oQWlTWGkva2Z5N3FOL3AxNWU2ZDVsYlI3WlomI3hBO2lwaE1ySTdBQUVQS0VrUUN0YVpzZFJNQWdHTnVvMCtJeUJJbHdoa1g1YmVZdk1VM21hZlM3aS9iVTdDSkplZHd6RjFBak5Ga1YyK0smI3hBO2pIYmZ4ekV6UkZYVk51anpUT1RoSjRnbDhla1E2NzU3MVcxRjRMWlhsbWVLY0FPR0ljVUFGVnI5K1ZIazBlR01tYVF1dWJQZksza0smI3hBO3kwSzVOMjF3MTNkVUtvNVVJcWh1cEMxYmVtMWE1VlRzTlBveGpOM1paUmhjeExkUTBSYnk3RS9ydEVENklsUUFHb2drYVJPSi9aKzImI3hBO3dieEdGVXB0UElPblc5cUlQV1kwOVA4QWVCUUcvZFNSdldwSm9XRVFVMDdZMmlsYlQvSmxyWXdSUlF6R2liU01WQkw3b1FkeWVKL2QmI3hBO0RwdDdZMmxXMDd5dkhaZlV3bHdTdGt6bU1oRVYyVitxdXcrMEQxTlJVa0E5Y2JWVmw4c2FaTE42OGthdE1aL1hlUmtVbGh5NWVtYS8mI3hBO3MxeHRVaW44aVhOczF0OVFranVVU1RsTEhkZkFsRkNyR1dXTmYzaEFVMUpPNXBYRzBVbXMzayswa2EzcE15UndLeStrRlVLeGRYVm0mI3hBO0lGS2x2VTNyWHA4NnRwUnVsNkZhYWROTExCUUdVeWNxS0YyZVo1Z052NWZWNGoyd1dxWllxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlgmI3hBO1lxN0ZYWXE3RlhZcTdGWFlxN0ZWTzYrcmZWcHZyWEQ2cndiMS9WcDZmcDArTG55MjQwNjF3aTcyUWFyZms4eGwvd0NWRS9XelgwdlYmI3hBO3J2NmYxejA2KzNEOTNUTXcrUFg5anJqK1Z2OEF0WnBvMytEZjBMYy9vajZ0K2pPRGZYUFEvbDRubDZsUGpyeDhkOHhaY1Y3ODNLeCsmI3hBO0h3bmhyaDZwRFkvOHFtK3RRL1ZmUitzZW92by8zLzI2amoxMjYrT0p2cTQwZnkxaXF2NHM4eURzWFlxN0ZYWXE3RlhZcTdGWFlxN0YmI3hBO1hZcTdGWC8vMlE9PTwveG1wR0ltZzppbWFnZT4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC94bXA6VGh1bWJuYWlscz4KICAgICAgICAgPHhtcE1NOlJlbmRpdGlvbkNsYXNzPmRlZmF1bHQ8L3htcE1NOlJlbmRpdGlvbkNsYXNzPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnV1aWQ6NjVFNjM5MDY4NkNGMTFEQkE2RTJEODg3Q0VBQ0I0MDc8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDplZTNlNDk5MC05ZTAzLTRhZDAtYTVmZi1mOGYxNDNhOGQ3ZWU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6ZWUzZTQ5OTAtOWUwMy00YWQwLWE1ZmYtZjhmMTQzYThkN2VlPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjAwODgwMTM3LWVkNzAtNGUyZS1iNzQwLThjZjU3MGM4YWI4ODwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDowMDg4MDEzNy1lZDcwLTRlMmUtYjc0MC04Y2Y1NzBjOGFiODg8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+dXVpZDo2NUU2MzkwNjg2Q0YxMURCQTZFMkQ4ODdDRUFDQjQwNzwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6cmVuZGl0aW9uQ2xhc3M+ZGVmYXVsdDwvc3RSZWY6cmVuZGl0aW9uQ2xhc3M+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDozZjc3YWY1OC1hYTkyLTQ4NjEtYTZhNy1jNjlmYWFkMTdhM2I8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjUtMDEtMjdUMTI6NTk6NTItMDU6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIElsbHVzdHJhdG9yIDI5LjIgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmVlM2U0OTkwLTllMDMtNGFkMC1hNWZmLWY4ZjE0M2E4ZDdlZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyNS0wMS0yN1QxMzowMTo0NS0wNTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgSWxsdXN0cmF0b3IgMjkuMiAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8aWxsdXN0cmF0b3I6U3RhcnR1cFByb2ZpbGU+V2ViPC9pbGx1c3RyYXRvcjpTdGFydHVwUHJvZmlsZT4KICAgICAgICAgPGlsbHVzdHJhdG9yOkNyZWF0b3JTdWJUb29sPkFkb2JlIElsbHVzdHJhdG9yPC9pbGx1c3RyYXRvcjpDcmVhdG9yU3ViVG9vbD4KICAgICAgICAgPHBkZjpQcm9kdWNlcj5BZG9iZSBQREYgbGlicmFyeSAxNy4wMDwvcGRmOlByb2R1Y2VyPgogICAgICAgICA8cGRmeDpDcmVhdG9yVmVyc2lvbj4yMS4wLjA8L3BkZng6Q3JlYXRvclZlcnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7/4AAQSkZJRgABAgEASABIAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABAASAAAAAEAAQBIAAAAAQAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/3QAEAJb/7gAOQWRvYmUAZMAAAAAB/8AAEQgAyASwAwARAAERAQIRAf/EAaIAAAEDBAMBAAAAAAAAAAAAAAUAAgYBBAkKAwgLBwEAAwEBAAMBAAMAAAAAAAAABQcIBgkAAwQKAQILEAAABQMCBAIAAwQOegMAAAABAgMEBQAGBzGBCBESQQkTFCEiFRYyURojNjlIUmF2d5a1trfTChcYGSQlJicoKSozNDU3ODpCQ0RFRkdJSlNUVVZXWFlaYmNkZWZnaGlqcXJzdHV4eXqCg4SFhoeIiYqRkpOUlZeYmZqhoqOkpaanqKmqsbKz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';
