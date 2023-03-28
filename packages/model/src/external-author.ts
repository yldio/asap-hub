import { ListResponse } from './common';
import { UserResponse } from './user';

export type ExternalAuthorDataObject = Pick<
  UserResponse,
  'id' | 'displayName' | 'orcid'
>;

export type ListExternalAuthorDataObject =
  ListResponse<ExternalAuthorDataObject>;

export type ExternalAuthorResponse = ExternalAuthorDataObject;
export type ListExternalAuthorResponse = ListResponse<ExternalAuthorResponse>;

export type ExternalAuthorCreateDataObject = {
  name: string;
  orcid?: string | undefined;
};
