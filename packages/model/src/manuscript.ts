import { JSONSchemaType } from 'ajv';
import { ascending, descending, SortingDirection } from './analytics';
import { AuthorAlgoliaResponse, AuthorResponse } from './authors';
import { ListResponse } from './common';
import { ComplianceReportDataObject } from './compliance-report';
import { DiscussionDataObject } from './discussion';
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
  count: number;
  versionUID?: string;
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
  availabilityStatement?: string;

  acknowledgedGrantNumberDetails?: DiscussionDataObject;
  asapAffiliationIncludedDetails?: DiscussionDataObject;
  manuscriptLicenseDetails?: DiscussionDataObject;
  datasetsDepositedDetails?: DiscussionDataObject;
  codeDepositedDetails?: DiscussionDataObject;
  protocolsDepositedDetails?: DiscussionDataObject;
  labMaterialsRegisteredDetails?: DiscussionDataObject;
  availabilityStatementDetails?: DiscussionDataObject;

  teams: { displayName: string; id: string; inactiveSince?: string }[];
  labs: { name: string; id: string; labPi?: string }[];

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
      'requestingApcCoverage',
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
      'requestingApcCoverage',
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
      'requestingApcCoverage',
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

export const manuscriptStatus = [
  'Waiting for Report',
  'Review Compliance Report',
  'Waiting for OS Team Reply',
  "Waiting for Grantee's Reply",
  'Manuscript Resubmitted',
  'Submit Final Publication',
  'Addendum Required',
  'Compliant',
  'Closed (other)',
] as const;

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

export type ManuscriptDataObject = {
  id: string;
  title: string;
  status?: ManuscriptStatus;
  teamId: string;
  versions: ManuscriptVersion[];
  count: number;
  assignedUsers: ManuscriptAssignedUser[];
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
export type ManuscriptUpdateStatus = Pick<ManuscriptDataObject, 'status'>;
export type ManuscriptUpdateContent = Partial<ManuscriptPostRequest>;
export type ManuscriptPutRequest =
  | ManuscriptUpdateAssignedUsers
  | ManuscriptUpdateStatus
  | ManuscriptUpdateContent;

export type ManuscriptUpdateDataObject =
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
  'title' | 'teamId' | 'eligibilityReasons'
> & {
  versions: (Pick<
    ManuscriptPostRequest['versions'][number],
    | 'type'
    | 'lifecycle'
    | 'preprintDoi'
    | 'publicationDoi'
    | 'requestingApcCoverage'
    | 'submitterName'
    | 'otherDetails'
    | 'description'
    | 'manuscriptFile'
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
    submissionDate?: ManuscriptVersion['submissionDate'];
    keyResourceTable: ManuscriptVersion['keyResourceTable'];
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
    },
    required: ['title', 'teamId', 'versions'],
    additionalProperties: false,
  };

export const manuscriptPutRequestSchema: JSONSchemaType<ManuscriptPutRequest> =
  {
    type: 'object',
    properties: {
      title: { type: 'string', nullable: true },
      teamId: { type: 'string', nullable: true },
      assignedUsers: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
      status: { enum: manuscriptStatus, type: 'string', nullable: true },
      versions: {
        type: 'array',
        maxItems: 1,
        items: manuscriptVersionSchema,
        nullable: true,
      },
    },
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

export type PartialManuscriptResponse = Pick<
  ManuscriptVersion,
  'id' | 'requestingApcCoverage'
> &
  Pick<ManuscriptResponse, 'status' | 'title'> & {
    lastUpdated: string;
    team: { id: string; displayName: string };
    assignedUsers: ManuscriptAssignedUser[];
    manuscriptId: string;
    teams: string;
  };

export type ListPartialManuscriptResponse =
  ListResponse<PartialManuscriptResponse>;

export type ManuscriptUpdateAction =
  | 'manuscript_submitted'
  | 'manuscript_resubmitted'
  | 'status_changed_waiting_for_grantee_reply'
  | 'status_changed_review_compliance_report'
  | 'status_changed_submit_final_publication'
  | 'status_changed_addendum_required'
  | 'status_changed_compliant'
  | 'status_changed_closed_other';

export type TemplateName =
  | 'Waiting for Report (Grantees)'
  | 'Waiting for Report (OS Team)'
  | 'Manuscript Re-Submitted (For Grantees)'
  | 'Manuscript Re-Submitted (For OS Team)'
  | 'Waiting for Grantee Reply'
  | 'Review Compliance Report'
  | 'Submit Final Publication'
  | 'Addendum Required'
  | 'Compliant'
  | 'Closed (Other)';

type ManuscriptNotifications = Record<
  ManuscriptUpdateAction,
  Partial<Record<'open_science_team' | 'grantee', TemplateName>>
>;

export const manuscriptNotificationMapping: ManuscriptNotifications = {
  manuscript_submitted: {
    grantee: 'Waiting for Report (Grantees)',
    open_science_team: 'Waiting for Report (OS Team)',
  },
  manuscript_resubmitted: {
    grantee: 'Manuscript Re-Submitted (For Grantees)',
    open_science_team: 'Manuscript Re-Submitted (For OS Team)',
  },
  status_changed_waiting_for_grantee_reply: {
    grantee: 'Waiting for Grantee Reply',
  },
  status_changed_review_compliance_report: {
    grantee: 'Review Compliance Report',
  },
  status_changed_submit_final_publication: {
    grantee: 'Submit Final Publication',
  },
  status_changed_addendum_required: {
    grantee: 'Addendum Required',
  },
  status_changed_compliant: {
    grantee: 'Compliant',
  },
  status_changed_closed_other: {
    grantee: 'Closed (Other)',
  },
};

export const completedStatusOptions = {
  show: 'Show',
  hide: 'Hide',
};

export type CompletedStatusOption = keyof typeof completedStatusOptions;
export const DEFAULT_COMPLETED_STATUS: CompletedStatusOption = 'hide';

export const requestedAPCCoverageOptions = {
  all: 'Show all',
  yes: 'Yes',
  no: 'No',
  submitted: 'Submitted',
};

export type RequestedAPCCoverageOption =
  keyof typeof requestedAPCCoverageOptions;

export const DEFAULT_REQUESTED_APC_COVERAGE: RequestedAPCCoverageOption = 'all';

export type ManuscriptError = {
  statusCode: number;
  response?: {
    message: string;
  };
};
