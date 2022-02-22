import { ListResponse } from './common';
import { UserResponse } from './user';

export type ExternalAuthorResponse = Pick<
  UserResponse,
  'displayName' | 'orcid'
>;

export type ListExternalAuthorResponse = ListResponse<ExternalAuthorResponse>;
