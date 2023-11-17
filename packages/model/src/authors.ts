import { ExternalAuthorResponse } from './external-author';
import { UserResponse } from './user';

export type UserAuthorResponse = {
  user: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'avatarUrl'
    | 'alumniSinceDate'
  >;
};

export type UserAuthor = {
  user: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'avatarUrl'
    | 'alumniSinceDate'
  > & { href: string };
};

export type ExternalUserAuthor = {
  externalUser: Pick<ExternalAuthorResponse, 'displayName'>;
};

export type AuthorResponse = UserAuthorResponse | ExternalUserAuthor;
export type Author = UserAuthor | ExternalUserAuthor;
