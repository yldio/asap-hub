import { DecisionOption, ListResponse } from './common';
import { EventDataObject } from './event';
import { ExternalAuthorResponse } from './external-author';
import { LabResponse } from './lab';
import { TeamResponse } from './team';
import { UserDataObject, UserResponse } from './user';
import { WorkingGroupResponse } from './working-group';

export const researchOutputDocumentTypes = [
  'Grant Document',
  'Presentation',
  'Dataset',
  'Bioinformatics',
  'Protocol',
  'Lab Material',
  'Article',
  'Report',
] as const;

export type ResearchOutputDocumentType =
  (typeof researchOutputDocumentTypes)[number];

export const researchOutputTypes = [
  '3D Printing',
  'ASAP annual meeting',
  'ASAP subgroup meeting',
  'Analysis',
  'Animal Model',
  'Antibody',
  'Assay',
  'Behavioral',
  'Biosample',
  'Cell Culture & Differentiation',
  'Cell line',
  'Cloning',
  'Code',
  'Compound',
  'Data portal',
  'Electrophysiology',
  'External meeting',
  'Genetic Data - DNA',
  'Genetic Data - RNA',
  'Genotyping',
  'Microscopy & Imaging',
  'Model System',
  'Plasmid',
  'Preprint',
  'Proposal',
  'Protein Data',
  'Protein expression',
  'Published',
  'Report',
  'Sample Prep',
  'Sequencing',
  'Shipment Procedure',
  'Software',
  'Spectroscopy',
  'Team meeting',
  'Viral Vector',
] as const;

export const ResearchOutputPublishingEntitiesValues = <const>[
  'Team',
  'Working Group',
];

export type ResearchOutputPublishingEntities =
  (typeof ResearchOutputPublishingEntitiesValues)[number];

export type ResearchOutputType = (typeof researchOutputTypes)[number];

export type ResearchOutputFilterOptionTypes =
  | ResearchOutputPublishingEntities
  | ResearchOutputDocumentType;

export const researchOutputDocumentTypeToType: Record<
  ResearchOutputDocumentType,
  Set<ResearchOutputType>
> = {
  Article: new Set<ResearchOutputType>(['Preprint', 'Published']),
  Dataset: new Set<ResearchOutputType>([
    'Behavioral',
    'Electrophysiology',
    'Genetic Data - DNA',
    'Genetic Data - RNA',
    'Protein Data',
    'Microscopy & Imaging',
    'Spectroscopy',
  ]),
  Bioinformatics: new Set<ResearchOutputType>([
    'Code',
    'Data portal',
    'Software',
  ]),
  Protocol: new Set<ResearchOutputType>([
    '3D Printing',
    'Analysis',
    'Assay',
    'Cell Culture & Differentiation',
    'Cloning',
    'Genotyping',
    'Microscopy & Imaging',
    'Model System',
    'Protein expression',
    'Sample Prep',
    'Sequencing',
    'Shipment Procedure',
  ]),
  'Lab Material': new Set<ResearchOutputType>([
    'Animal Model',
    'Antibody',
    'Assay',
    'Biosample',
    'Cell line',
    'Compound',
    'Plasmid',
    'Viral Vector',
  ]),
  Presentation: new Set<ResearchOutputType>([
    'ASAP annual meeting',
    'ASAP subgroup meeting',
    'External meeting',
    'Team meeting',
  ]),
  'Grant Document': new Set<ResearchOutputType>(['Proposal', 'Report']),
  Report: new Set(),
};

export const isResearchOutputDocumentType = (
  type: string,
): type is ResearchOutputDocumentType =>
  (researchOutputDocumentTypes as ReadonlyArray<string>).includes(type);

export const isResearchOutputType = (
  type: string,
): type is ResearchOutputType =>
  (researchOutputTypes as ReadonlyArray<string>).includes(type);

export const researchOutputMapType = (
  type?: string | null,
): ResearchOutputType | null => {
  if (type && isResearchOutputType(type)) {
    return type;
  }

  return null;
};

export enum ResearchOutputIdentifierType {
  Empty = '',
  None = 'None',
  DOI = 'DOI',
  AccessionNumber = 'Accession Number',
  RRID = 'RRID',
}

export const researchOutputToIdentifierType: Record<
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType[]
> = {
  Article: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
  ],
  Bioinformatics: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
  ],
  'Lab Material': [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.RRID,
  ],
  Dataset: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.AccessionNumber,
  ],
  Protocol: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
  ],
  'Grant Document': [],
  Presentation: [],
  Report: [],
};

export const sharingStatuses = ['Public', 'Network Only'] as const;

export type ResearchOutputSharingStatus = (typeof sharingStatuses)[number];

export type ResearchOutputCoreObject = {
  accession?: string;
  addedDate?: string;
  asapFunded?: boolean;
  description?: string;
  shortDescription?: string;
  descriptionMD?: string;
  documentType: ResearchOutputDocumentType;
  doi?: string;
  isInReview: boolean;
  labCatalogNumber?: string;
  lastModifiedDate?: string;
  link?: string;
  publishDate?: string;
  rrid?: string;
  sharingStatus: ResearchOutputSharingStatus;
  title: string;
  type?: ResearchOutputType;
  usageNotes?: string;
  usedInPublication?: boolean;
  researchTheme?: string[];
};

export type ResearchOutputVersionCoreObject = Pick<
  ResearchOutputCoreObject,
  | 'documentType'
  | 'type'
  | 'title'
  | 'link'
  | 'addedDate'
  | 'doi'
  | 'rrid'
  | 'accession'
>;

export type ResearchOutputVersionPostRequest = ResearchOutputVersionCoreObject;

export type ResearchOutputVersion = ResearchOutputVersionCoreObject & {
  id: string;
};

export type ResearchOutputDataObject = ResearchOutputCoreObject & {
  authors: (
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
  usageNotesMD?: string;
  contactEmails: string[];
  created: string;
  environments: string[];
  id: string;
  labs: LabResponse[];
  lastUpdatedPartial: string;
  methods: string[];
  organisms: string[];
  subtype?: string;
  keywords: string[];
  teams: Pick<TeamResponse, 'id' | 'displayName'>[];
  workingGroups: Pick<WorkingGroupResponse, 'id' | 'title'>[];
  published: boolean;
  relatedResearch: Array<
    Pick<
      ResearchOutputDataObject,
      'id' | 'title' | 'type' | 'documentType' | 'teams' | 'workingGroups'
    > & { isOwnRelatedResearchLink?: boolean }
  >;
  versions: Array<ResearchOutputVersion>;
  relatedEvents: Array<Pick<EventDataObject, 'id' | 'title' | 'endDate'>>;
  statusChangedBy?: Pick<UserDataObject, 'id' | 'firstName' | 'lastName'>;
  statusChangedAt?: string;
  publishingEntity: ResearchOutputPublishingEntities;
};

export type ResearchOutputDraftDataObject = Omit<
  ResearchOutputDataObject,
  'addedDate'
>;
export type ResearchOutputPublishedDataObject = ResearchOutputDataObject & {
  addedDate: string;
};

export type ListResearchOutputDataObject =
  ListResponse<ResearchOutputDataObject>;

export type AuthorUpsertDataObject =
  | { userId: string }
  | { externalAuthorId: string };

export type ResearchOutputCreateDataObject = ResearchOutputCoreObject & {
  authors: AuthorUpsertDataObject[];
  createdBy: string;
  environmentIds: string[];
  labIds: string[];
  methodIds: string[];
  organismIds: string[];
  subtypeId?: string;
  keywordIds: string[];
  teamIds: string[];
  workingGroups?: string[];
  relatedResearchIds: string[];
  relatedEventIds: string[];
};

export type PublishedResearchOutputCreateDataObject =
  ResearchOutputCreateDataObject & {
    addedDate: string;
  };

export type DraftResearchOutputCreateDataObject = Omit<
  ResearchOutputCreateDataObject,
  'addedDate'
>;

export type ResearchOutputUpdateDataObject = ResearchOutputCoreObject & {
  authors: AuthorUpsertDataObject[];
  environmentIds: string[];
  labIds: string[];
  methodIds: string[];
  organismIds: string[];
  subtypeId?: string;
  keywordIds: string[];
  teamIds: string[];
  updatedBy: string;
  workingGroups: string[];
  relatedResearchIds: string[];
  relatedEventIds: string[];
  statusChangedById?: string;
  statusChangedAt?: string;
  versions?: string[];
};

export type ResearchOutputBaseResponse = Omit<
  ResearchOutputDataObject,
  'createdBy' | 'workingGroups'
>;

export type ResearchOutputTeamResponse = ResearchOutputBaseResponse & {
  workingGroups: undefined;
};

export type ResearchOutputWorkingGroupResponse = ResearchOutputBaseResponse & {
  workingGroups: [Pick<WorkingGroupResponse, 'id' | 'title'>];
};

export type ResearchOutputResponse =
  | ResearchOutputWorkingGroupResponse
  | ResearchOutputTeamResponse;

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;

export type PublicResearchOutputResponse = Pick<
  ResearchOutputResponse,
  | 'id'
  | 'title'
  | 'sharingStatus'
  | 'asapFunded'
  | 'type'
  | 'relatedResearch'
  | 'created'
  | 'description'
  | 'shortDescription'
  | 'researchTheme'
  | 'documentType'
> & {
  hyperlink: ResearchOutputResponse['link'];
  teams: string[];
  authors: Array<{ id?: string; name: string }>;
  tags: string[];
  persistentIdentifier: ResearchOutputResponse['doi'];
  finalPublishDate?: string;
  preprintPublishDate?: string;
  preprint?: {
    title?: string;
    link?: string;
    addedDate?: string;
  };
};

export type ListPublicOutputResponse =
  ListResponse<PublicResearchOutputResponse>;

export type AuthorPostRequest =
  | { userId: string }
  | { externalAuthorId: string }
  | { externalAuthorName: string };

export type ResearchOutputPostRequest = {
  accession?: string;
  asapFunded?: boolean;
  authors?: AuthorPostRequest[];
  description?: string;
  descriptionMD: string;
  shortDescription: string;
  documentType: ResearchOutputDocumentType;
  doi?: string;
  environments: string[];
  isInReview?: boolean;
  labCatalogNumber?: string;
  labs?: string[];
  link?: string;
  methods: string[];
  organisms: string[];
  publishDate?: string;
  rrid?: string;
  sharingStatus: ResearchOutputSharingStatus;
  subtype?: string;
  keywords: string[];
  teams: string[];
  workingGroups: string[];
  relatedResearch: string[];
  title: string;
  type?: ResearchOutputType;
  usageNotes?: string;
  usedInPublication?: boolean;
  published: boolean;
  relatedEvents: string[];
};

export type OutputGenerateContentResponse = Partial<
  Pick<ResearchOutputResponse, 'shortDescription'>
>;

export type ResearchOutputGenerateContentRequest = Partial<
  Pick<ResearchOutputPostRequest, 'descriptionMD'>
>;

export type ResearchOutputAssociations = 'team' | 'teams' | 'working group';

export type ResearchOutputPutRequest = ResearchOutputPostRequest & {
  statusChangedById?: string;
  hasStatusChanged?: boolean;
  isInReview: boolean;
  createVersion?: boolean;
};

type NonEmptyArray<T> = [T, ...T[]];

export type ResearchOutputWorkingGroupPostRequest =
  ResearchOutputPostRequest & {
    workingGroups: NonEmptyArray<string>;
  };

export const convertDecisionToBoolean = (
  decision: string | null | DecisionOption,
): boolean | undefined =>
  decision && ['Yes', 'No'].includes(decision) ? decision === 'Yes' : undefined;

export const convertBooleanToDecision = (bool?: boolean): DecisionOption => {
  if (typeof bool === 'undefined') {
    return 'Not Sure';
  }
  return bool ? 'Yes' : 'No';
};
