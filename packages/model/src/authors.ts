import { ExternalAuthorResponse } from './external-author';
import { UserResponse } from './user';

export type AuthorResponse =
  | Pick<
      UserResponse,
      'email' | 'id' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName'
    >
  | ExternalAuthorResponse;

export type AuthorAlgoliaResponse =
  | (Pick<
      UserResponse,
      'email' | 'id' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName'
    > & {
      teams: {
        id: string;
        displayName?: string;
        role: string;
      }[];
      __meta: {
        type: 'user';
      };
    })
  | (ExternalAuthorResponse & {
      __meta: {
        type: 'external-author';
      };
    });
