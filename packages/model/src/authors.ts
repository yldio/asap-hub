import { ExternalAuthorResponse } from './external-author';
import { UserResponse } from './user';

export type AuthorResponse =
  | Pick<
      UserResponse,
      'email' | 'id' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName'
    >
  | ExternalAuthorResponse;
