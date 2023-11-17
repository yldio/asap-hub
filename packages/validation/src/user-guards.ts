import { UserResponse, ExternalAuthorResponse } from '@asap-hub/model';

type ExternalAuthor = Pick<ExternalAuthorResponse, 'displayName'>;

export const isInternalUser = (
  author: ExternalAuthor | UserResponse,
): author is UserResponse => (author as UserResponse).email !== undefined;

export const isExternalUser = (
  author: ExternalAuthor | UserResponse,
): author is ExternalAuthor =>
  isInternalUser(author as ExternalAuthor) === false;
