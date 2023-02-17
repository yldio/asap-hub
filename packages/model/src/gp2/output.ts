import { FetchOptions, ListResponse } from '../common';
import { ExternalAuthorResponse } from '../external-author';

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

export const isOutputDocumentType = (
  type: string,
): type is OutputDocumentType =>
  (outputDocumentTypes as ReadonlyArray<string>).includes(type);

export const isOutputType = (type: string): type is OutputType =>
  (outputTypes as ReadonlyArray<string>).includes(type);

export const outputMapType = (type?: string | null): OutputType | null => {
  if (type && isOutputType(type)) {
    return type;
  }

  return null;
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

type UserAuthor = {
  id: string;
  firstName: string;
  lastName: string;
  onboarded: boolean;
  avatarUrl?: string;
};
export type OutputDataObject = OutputCoreObject & {
  authors: (UserAuthor | ExternalAuthorResponse)[];
  created: string;
  id: string;
  lastUpdatedPartial: string;
  // workingGroups: Pick<WorkingGroupResponse, 'id' | 'title'>[];
};

export type ListOutputDataObject = ListResponse<OutputDataObject>;

export type AuthorUpsertDataObject =
  | { userId: string }
  | { externalAuthorId: string };

export type OutputCreateDataObject = OutputCoreObject & {
  authors: AuthorUpsertDataObject[];
  createdBy: string;
};

export type OutputUpdateDataObject = OutputCoreObject & {
  authors: AuthorUpsertDataObject[];
  updatedBy: string;
};

export type OutputBaseResponse = Omit<
  OutputDataObject,
  'createdBy' | 'workingGroups'
>;

export type OutputTeamResponse = OutputBaseResponse & {
  workingGroups: undefined;
};

export type OutputResponse = OutputBaseResponse;

export type ListOutputResponse = ListResponse<OutputResponse>;

export type AuthorPostRequest =
  | { userId: string }
  | { externalAuthorId: string }
  | { externalAuthorName: string };

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
