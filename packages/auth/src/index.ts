import type { Auth0Client } from '@auth0/auth0-spa-js';
import type { UserMetadataResponse, UserResponse } from '@asap-hub/model';

import * as config from './config';
import auth0PubKeys from './pubKeys';

export { config, auth0PubKeys };

export type User = Pick<
  UserMetadataResponse,
  | 'id'
  | 'onboarded'
  | 'displayName'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'algoliaApiKey'
> & {
  teams: ReadonlyArray<UserResponse['teams'][0]>;
};

export interface Auth0User {
  readonly sub: string;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
  readonly aud: string;
  readonly [customUserClaim: string]: string | undefined | User;
}

export type Auth0 = {
  readonly isAuthenticated?: boolean;
  readonly user?: Auth0User;
  readonly loading: boolean;
  readonly popupOpen: boolean;
  readonly checkSession?: () => Promise<void>;
} & Pick<
  Auth0Client,
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'loginWithPopup'
  | 'handleRedirectCallback'
  | 'getTokenSilently'
  | 'getTokenWithPopup'
  | 'logout'
>;
