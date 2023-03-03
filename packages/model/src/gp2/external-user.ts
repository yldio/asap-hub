import { ListResponse } from '../common';
import { UserResponse } from '../user';

export type ExternalUserResponse = Pick<
  UserResponse,
  'id' | 'displayName' | 'orcid'
>;

export type ListExternalUserResponse = ListResponse<ExternalUserResponse>;

export type ExternalUserCreateDataObject = {
  name: string;
  orcid?: string | undefined;
};
