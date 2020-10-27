import type { Auth0Client } from '@auth0/auth0-spa-js';
import type { UserResponse } from '@asap-hub/model';

import * as config from './config';

export { default as decodeToken } from './decode-token';
export { config };

export type User = Pick<
  UserResponse,
  'id' | 'displayName' | 'email' | 'firstName' | 'lastName' | 'avatarUrl'
> & {
  teams: ReadonlyArray<Pick<UserResponse['teams'][0], 'id' | 'displayName'>>;
};

export interface Auth0User {
  readonly sub: string;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
  readonly [customUserClaim: string]: string | undefined | User;
}

export type Auth0 = {
  readonly isAuthenticated?: boolean;
  readonly user?: Auth0User;
  readonly loading: boolean;
  readonly popupOpen: boolean;
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
