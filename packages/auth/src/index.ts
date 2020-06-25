import type { Auth0Client } from '@auth0/auth0-spa-js';

import * as config from './config';

export { config };

export interface User {
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
}

export type Auth0 = {
  readonly isAuthenticated?: boolean;
  readonly user?: User;
  readonly loading: boolean;
  readonly popupOpen: boolean;
  readonly handleRedirectCallback: () => Promise<void>;
} & Pick<
  Auth0Client,
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'loginWithPopup'
  | 'getTokenSilently'
  | 'getTokenWithPopup'
  | 'logout'
>;
