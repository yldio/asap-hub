import { JSONSchemaType } from 'ajv';
import { ascending, descending, SortingDirection } from './analytics';
import { AuthorAlgoliaResponse, AuthorResponse } from './authors';
import { CategoryResponse } from './category';
import { ListResponse } from './common';
import { ComplianceReportDataObject } from './compliance-report';
import { ManuscriptDiscussion } from './discussion';
import { ExternalAuthorResponse } from './external-author';
import { ImpactResponse } from './impact';
import { ProjectType } from './project';
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

export const mapManuscriptTypeToSubType = (manuscriptType: ManuscriptType) =>
  manuscriptType === 'Original Research' ? 'Original Research' : 'Review';

export const mapManuscriptLifecycleToType = (
  manuscriptLifecycle: ManuscriptLifecycle,
) => (manuscriptLifecycle === 'Preprint' ? 'Preprint' : 'Published');

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

export const manuscriptFileTypes = [
  'Manuscript File',
  'Key Resource Table',
  'Additional Files',
  'Compliance Report Response',
  'Discussion Files',
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
  complianceReportResponse?: ManuscriptFile;
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

  teams: {
    displayName: string;
    id: string;
    inactiveSince?: string;
    projectId?: string;
    projectType?: ProjectType;
  }[];
  labs: { name: string; id: string; labPi?: string; labPITeamIds?: string[] }[];
  url?: string;

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
      | keyof Omit<
          ManuscriptVersion,
          | 'complianceReport'
          | 'complianceReportResponse'
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
      | 'preprintDate'
      | 'publicationDate'
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
      'preprintDate',
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
      'publicationDate',
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
      'publicationDate',
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
    Preprint: ['preprintDate'],
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
      'publicationDate',
    ],
    'Publication with addendum or corrigendum': [
      'publicationDoi',
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'manuscriptLicense',
      'publicationDate',
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
  preprintDate?: string;
  publicationDate?: string;
  url?: string;
  status?: ManuscriptStatus;
  teamId?: string;
  projectId?: string;
  projectType?: ProjectType;
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
  layImpactStatement?: string;
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
  | 'title'
  | 'teamId'
  | 'projectId'
  | 'url'
  | 'preprintDate'
  | 'publicationDate'
  | 'layImpactStatement'
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
    complianceReportResponse?: ManuscriptVersion['complianceReportResponse'];
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
    labs: string[];
    firstAuthors: ManuscriptPostAuthor[];
    correspondingAuthor?: ManuscriptPostAuthor;
    additionalAuthors?: ManuscriptPostAuthor[];
    url?: string;
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
  'title' | 'teamId' | 'eligibilityReasons' | 'url' | 'layImpactStatement'
> & {
  preprintDate?: string;
  publicationDate?: string;
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
    | 'url'
  > & {
    manuscriptFile: ManuscriptVersion['manuscriptFile'] | null;
    keyResourceTable: ManuscriptVersion['keyResourceTable'] | null;
    complianceReportResponse: ManuscriptVersion['manuscriptFile'] | null;
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
    url: { type: 'string', nullable: true },
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
    complianceReportResponse: {
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
    availabilityStatement: { type: 'string', nullable: true },
    acknowledgedGrantNumberDetails: { type: 'string', nullable: true },
    asapAffiliationIncludedDetails: { type: 'string', nullable: true },
    manuscriptLicenseDetails: { type: 'string', nullable: true },
    datasetsDepositedDetails: { type: 'string', nullable: true },
    codeDepositedDetails: { type: 'string', nullable: true },
    protocolsDepositedDetails: { type: 'string', nullable: true },
    labMaterialsRegisteredDetails: { type: 'string', nullable: true },
    availabilityStatementDetails: { type: 'string', nullable: true },

    teams: { type: 'array', items: { type: 'string' } },
    labs: { type: 'array', minItems: 1, items: { type: 'string' } },
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
      projectId: { type: 'string' },
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
      preprintDate: { type: 'string', nullable: true, format: 'date-time' },
      publicationDate: { type: 'string', nullable: true, format: 'date-time' },
      impact: { type: 'string', nullable: true },
      layImpactStatement: { type: 'string' },
      categories: { type: 'array', items: { type: 'string' }, nullable: true },
    },
    required: ['title', 'versions'],
    additionalProperties: false,
    oneOf: [
      {
        type: 'object',
        required: ['teamId'],
      },
      {
        type: 'object',
        required: ['projectId'],
      },
    ],
  } as unknown as JSONSchemaType<ManuscriptPostRequest>;

export const manuscriptPutRequestSchema: JSONSchemaType<ManuscriptPutRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string', nullable: true },
      url: { type: 'string', nullable: true },
      teamId: { type: 'string', nullable: true },
      projectId: { type: 'string', nullable: true },
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
      preprintDate: { type: 'string', nullable: true, format: 'date-time' },
      publicationDate: { type: 'string', nullable: true, format: 'date-time' },
      layImpactStatement: { type: 'string', nullable: true },
    },
    additionalProperties: false,
    not: {
      required: ['teamId', 'projectId'],
    },
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
    project?: {
      id: string;
      title: string;
      projectType?: ProjectType;
      isTeamBased?: boolean;
    };
    team: { id: string; displayName: string };
    assignedUsers: ManuscriptAssignedUser[];
    manuscriptId: string;
    teams: string;
  };

export type ListPartialManuscriptResponse =
  ListResponse<PartialManuscriptResponse>;

export type ManuscriptVersionResponse = {
  id: string;
  hasLinkedResearchOutput: boolean;
  type?: ManuscriptType;
  lifecycle?: ManuscriptLifecycle;
  teamId?: string;
  title: string;
  url: string;
  impact?: ImpactResponse;
  layImpactStatement?: string;
  categories?: CategoryResponse[];
  labs?: { id: string; name: string }[];
  authors?: (
    | Pick<
        UserResponse,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'displayName'
        | 'avatarUrl'
        | 'orcid'
        | 'email'
        | 'alumniSinceDate'
      >
    | ExternalAuthorResponse
  )[];
  teams?: { id: string; displayName: string }[];
  description?: string;
  shortDescription?: string;
  manuscriptId?: string;
  versionId?: string;
  doi?: string;
  researchOutputId?: string;
  preprintDate?: string;
  publicationDate?: string;
};

export type ListManuscriptVersionResponse =
  ListResponse<ManuscriptVersionResponse>;

export type ManuscriptVersionDataObject = {
  versionFound: boolean;
  latestManuscriptVersion?: ManuscriptVersionResponse;
};

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

export type {
  ManuscriptWorkspaceContext,
  ManuscriptWorkspaceTab,
  ManuscriptWorkspaceUrlResponse,
  ManuscriptWorkspaceUserContext,
} from './manuscript-workspace-url';

export type ManuscriptVersionExport = {
  id: string;
  title: string;
  url?: string;
  type: string;
  lifecycle: string;
  manuscriptId: string;
  manuscriptFile: string;
  keyResourceTable?: string;
  additionalFiles?: string;
  preprintDoi?: string;
  publicationDoi?: string;
  otherDetails?: string;
  description: string;
  shortDescription: string;
  impact?: string;
  layImpactStatement?: string;
  categories?: string;
  mainProject: string;
  teams: string;
  status: string;
  preprintDate?: string;
  publicationDate?: string;
  apcRequested?: string;
  apcAmountRequested?: string;
  apcCoverageRequestStatus?: string;
  apcAmountPaid?: string;
  declinedReason?: string;
  acknowledgedGrantNumber?: string;
  acknowledgedGrantNumberDetails?: string;
  asapAffiliationIncluded?: string;
  asapAffiliationIncludedDetails?: string;
  manuscriptLicense?: string;
  manuscriptLicenseDetails?: string;
  datasetsDeposited?: string;
  datasetsDepositedDetails?: string;
  codeDeposited?: string;
  codeDepositedDetails?: string;
  protocolsDeposited?: string;
  protocolsDepositedDetails?: string;
  labMaterialsRegistered?: string;
  labMaterialsRegisteredDetails?: string;
  availabilityStatement?: string;
  availabilityStatementDetails?: string;
  firstAuthors: string;
  correspondingAuthor?: string;
  additionalAuthors?: string;
  assignedUsers?: string;
  labs?: string;
  complianceReportUrl?: string;
  complianceReportDescription?: string;
  complianceReportResponse?: string;
  versionLastUpdatedDate: string;
};

export type ListManuscriptVersionExportResponse =
  ListResponse<ManuscriptVersionExport>;

export type FileAction = 'upload' | 'download';

export const apcRequestedOptions = ['Requested', 'Not Requested'] as const;
export type APCRequestedOption = (typeof apcRequestedOptions)[number];
