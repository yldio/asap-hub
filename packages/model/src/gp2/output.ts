import { FetchOptions, ListResponse } from '../common';
import { ExternalUserResponse } from './external-user';

export const outputDocumentTypes = [
  'Forms',
  'Updates',
  'Training Materials',
  'Data Releases',
  'Articles',
  'Code/Software',
] as const;

export type OutputDocumentType = typeof outputDocumentTypes[number];

export const outputTypes = [
  'Research',
  'Review',
  'Letter',
  'Hot Topic',
  'Blog',
] as const;
export type OutputType = typeof outputTypes[number];

export const outputSubTypes = ['Preprints', 'Published'] as const;
export type OutputSubType = typeof outputSubTypes[number];

export const outputDocumentTypeToType: Record<
  OutputDocumentType,
  Set<OutputType>
> = {
  Forms: new Set<OutputType>(),
  Updates: new Set<OutputType>(),
  'Training Materials': new Set<OutputType>(),
  'Data Releases': new Set<OutputType>(),
  Articles: new Set<OutputType>([
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
  subtype?: OutputSubType;
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

export type OutputDataObject = OutputCoreObject & {
  authors: (UserAuthor | ExternalUserResponse)[];
  created: string;
  id: string;
  lastUpdatedPartial: string;
  workingGroups?: OutputOwner;
  projects?: OutputOwner;
};

export type ListOutputDataObject = ListResponse<OutputDataObject>;

export type AuthorUpsertDataObject =
  | { userId: string }
  | { externalUserId: string };

export type OutputCreateDataObject = OutputCoreObject & {
  authors: AuthorUpsertDataObject[];
  createdBy: string;
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
  subtype?: OutputSubType;
};

export type OutputPutRequest = OutputPostRequest;

export type FetchOutputFilter = {
  documentType?: string | string[];
  title?: string;
  link?: string;
};

export type FetchOutputOptions = FetchOptions<FetchOutputFilter> & {
  includeDrafts?: boolean;
};
