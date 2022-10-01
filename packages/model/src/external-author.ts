import { ListResponse } from './common';
import { UserResponse } from './user';

export type ExternalAuthorResponse = Pick<
  UserResponse,
  'id' | 'displayName' | 'orcid' | 'alumniSinceDate'
>;

export type ListExternalAuthorResponse = ListResponse<ExternalAuthorResponse>;

export type ExternalAuthorCreateDataObject = {
  name: string;
  orcid?: string | undefined;
};
