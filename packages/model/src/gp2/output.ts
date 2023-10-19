import { FetchOptions, ListResponse } from '../common';
import { ContributingCohortDataObject } from './contributing-cohort';
import { EventDataObject } from './event';
import { ExternalUserResponse } from './external-user';
import { TagDataObject } from './tag';

export const outputDocumentTypes = [
  'Article',
  'Code/Software',
  'Dataset',
  'GP2 Reports',
  'Procedural Form',
  'Training Materials',
] as const;

export type OutputDocumentType = (typeof outputDocumentTypes)[number];

export enum OutputIdentifierType {
  Empty = '',
  None = 'None',
  DOI = 'DOI',
  AccessionNumber = 'Accession Number',
  RRID = 'RRID',
}

export const outputToIdentifierType: Record<
  OutputDocumentType,
  OutputIdentifierType[]
> = {
  Article: [OutputIdentifierType.None, OutputIdentifierType.DOI],
  'Code/Software': [
    OutputIdentifierType.None,
    OutputIdentifierType.DOI,
    OutputIdentifierType.RRID,
  ],
  Dataset: [
    OutputIdentifierType.None,
    OutputIdentifierType.DOI,
    OutputIdentifierType.AccessionNumber,
  ],
  'Procedural Form': [OutputIdentifierType.None, OutputIdentifierType.DOI],
  'GP2 Reports': [],
  'Training Materials': [],
};

export const outputTypes = [
  'Research',
  'Review',
  'Letter',
  'Hot Topic',
  'Blog',
] as const;
export type OutputType = (typeof outputTypes)[number];

export const outputSubtypes = ['Preprints', 'Published'] as const;
export type OutputSubtype = (typeof outputSubtypes)[number];

export const outputDocumentTypeToType: Record<
  OutputDocumentType,
  Set<OutputType>
> = {
  'Procedural Form': new Set<OutputType>(),
  'GP2 Reports': new Set<OutputType>(),
  'Training Materials': new Set<OutputType>(),
  Dataset: new Set<OutputType>(),
  Article: new Set<OutputType>([
    'Research',
    'Review',
    'Letter',
    'Hot Topic',
    'Blog',
  ]),
  'Code/Software': new Set<OutputType>(),
};

export const decisionOptions = ['Yes', 'No', "Don't Know"] as const;

export type DecisionOption = (typeof decisionOptions)[number];

export const sharingStatuses = ['GP2 Only', 'Public'] as const;

export type OutputSharingStatus = (typeof sharingStatuses)[number];
type RelatedOutputs = {
  id: string;
  title: string;
  type?: OutputType;
  documentType: OutputDocumentType;
};
export type OutputCoreObject = {
  addedDate: string;
  documentType: OutputDocumentType;
  lastModifiedDate?: string;
  link?: string;
  publishDate?: string;
  title: string;
  type?: OutputType;
  subtype?: OutputSubtype;
  description?: string;
  gp2Supported?: DecisionOption;
  sharingStatus: OutputSharingStatus;
  tags: TagDataObject[];
  doi?: string;
  rrid?: string;
  accessionNumber?: string;
  relatedOutputs: RelatedOutputs[];
  relatedEvents: Pick<EventDataObject, 'id' | 'title' | 'endDate'>[];
};

export type UserAuthor = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  onboarded: boolean;
  avatarUrl?: string;
};

export type OutputOwner = {
  id: string;
  title: string;
  type?: 'Projects' | 'WorkingGroups';
};
export type OutputAuthor = UserAuthor | ExternalUserResponse;
export type OutputDataObject = OutputCoreObject & {
  authors: OutputAuthor[];
  created: string;
  id: string;
  lastUpdatedPartial: string;
  workingGroups?: OutputOwner[];
  projects?: OutputOwner[];
  contributingCohorts: ContributingCohortDataObject[];
  mainEntity: OutputOwner;
};

export type ListOutputDataObject = ListResponse<OutputDataObject>;

export type AuthorUpsertDataObject =
  | { userId: string; externalUserId?: undefined }
  | { externalUserId: string; userId?: undefined };

export type OutputUpsertDataObject = Omit<
  OutputCoreObject,
  'relatedOutputs' | 'relatedEvents' | 'tags'
> & {
  authors: AuthorUpsertDataObject[];
  tagIds: string[];
  workingGroupIds?: string[];
  projectIds?: string[];
  mainEntityId: string;
  contributingCohortIds: string[];
  relatedOutputIds: string[];
  relatedEventIds: string[];
};
export type OutputCreateDataObject = OutputUpsertDataObject & {
  createdBy: string;
};

export type OutputUpdateDataObject = OutputUpsertDataObject & {
  updatedBy: string;
};

export type OutputBaseResponse = Omit<OutputDataObject, 'createdBy'>;

export type OutputResponse = OutputBaseResponse;

export type ListOutputResponse = ListResponse<OutputResponse>;

export type AuthorPostRequest =
  | { userId: string }
  | { externalUserId: string }
  | { externalUserName: string };

export type OutputPostRequest = {
  authors?: AuthorPostRequest[];
  documentType: OutputDocumentType;
  link?: string;
  publishDate?: string;
  title: string;
  type?: OutputType;
  subtype?: OutputSubtype;
  description?: string;
  gp2Supported?: DecisionOption;
  sharingStatus: OutputSharingStatus;
  workingGroupIds?: string[];
  projectIds?: string[];
  tagIds: string[];
  doi?: string;
  rrid?: string;
  accessionNumber?: string;
  contributingCohortIds: string[];
  mainEntityId: string;
  relatedOutputIds: string[];
  relatedEventIds: string[];
};

export type OutputPutRequest = OutputPostRequest;

export type FetchOutputSearchFilter = {
  documentType?: OutputDocumentType[];
};
export type FetchOutputFilter = FetchOutputSearchFilter & {
  authorId?: string;
  eventId?: string;
  externalAuthorId?: string;
  link?: string;
  projectId?: string;
  title?: string;
  workingGroupId?: string;
};

export type FetchOutputOptions = FetchOptions<FetchOutputFilter>;
