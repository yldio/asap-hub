import { UserResponse, ExternalAuthorResponse } from '@asap-hub/model';

export const isInternalUser = (
  author: ExternalAuthorResponse | UserResponse,
): author is UserResponse => (author as UserResponse).email !== undefined;

export const isExternalUser = (
  author: ExternalAuthorResponse | UserResponse,
): author is ExternalAuthorResponse =>
  isInternalUser(author as ExternalAuthorResponse) === false;
