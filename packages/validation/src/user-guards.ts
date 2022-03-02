import { UserResponse, ExternalAuthorResponse } from '@asap-hub/model';

export const isInternalUser = (
  author: ExternalAuthorResponse | UserResponse,
): author is UserResponse => (author as UserResponse).email !== undefined;
