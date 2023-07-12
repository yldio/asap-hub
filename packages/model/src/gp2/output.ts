import { FetchOptions, ListResponse } from '../common';
import { ExternalUserResponse } from './external-user';

export const outputDocumentTypes = [
  'Procedural Form',
  'GP2 Reports',
  'Training Materials',
  'Dataset',
  'Article',
  'Code/Software',
] as const;

export type OutputDocumentType = (typeof outputDocumentTypes)[number];

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

export type OutputCoreObject = {
  addedDate: string;
  documentType: OutputDocumentType;
  lastModifiedDate?: string;
  link?: string;
  publishDate?: string;
  title: string;
  type?: OutputType;
  subtype?: OutputSubtype;
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

type OutputOwner = {
  id: string;
  title: string;
};
export type OutputAuthor = UserAuthor | ExternalUserResponse;
export type OutputDataObject = OutputCoreObject & {
  authors: OutputAuthor[];
  created: string;
  id: string;
  lastUpdatedPartial: string;
  workingGroup?: OutputOwner;
  project?: OutputOwner;
};

export type ListOutputDataObject = ListResponse<OutputDataObject>;

export type AuthorUpsertDataObject =
  | { userId: string; externalUserId?: undefined }
  | { externalUserId: string; userId?: undefined };

export type OutputCreateDataObject = OutputCoreObject & {
  authors: AuthorUpsertDataObject[];
  createdBy: string;
  workingGroup?: string;
  project?: string;
};

export type OutputUpdateDataObject = OutputCoreObject & {
  authors: AuthorUpsertDataObject[];
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
  workingGroup?: string;
  project?: string;
};

export type OutputPutRequest = OutputPostRequest;

export type FetchOutputFilter = {
  documentType?: string | string[];
  title?: string;
  link?: string;
  workingGroup?: string;
  project?: string;
  author?: string;
};

export type FetchOutputOptions = FetchOptions<FetchOutputFilter> & {
  includeDrafts?: boolean;
};
