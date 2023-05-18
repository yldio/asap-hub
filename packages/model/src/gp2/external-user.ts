import { FetchOptions, ListResponse } from '../common';

export type ExternalUserDataObject = {
  id: string;
  name: string;
  orcid?: string;
};

export type ListExternalUserDataObject = ListResponse<ExternalUserDataObject>;

export type ExternalUserResponse = Pick<
  ExternalUserDataObject,
  'id' | 'orcid'
> & { displayName: string };

export type ListExternalUserResponse = ListResponse<ExternalUserResponse>;

export type ExternalUserCreateDataObject = {
  name: string;
  orcid?: string | undefined;
};

export type FetchExternalUsersOptions = FetchOptions;
