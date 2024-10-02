import { ExternalAuthorResponse, UserListItemResponse } from '@asap-hub/model';

export const isInternalUser = (
  author: ExternalAuthorResponse | UserListItemResponse,
): author is UserListItemResponse =>
  (author as UserListItemResponse).firstName !== undefined;

export const isExternalUser = (
  author: ExternalAuthorResponse | UserListItemResponse,
): author is ExternalAuthorResponse =>
  isInternalUser(author as ExternalAuthorResponse) === false;
