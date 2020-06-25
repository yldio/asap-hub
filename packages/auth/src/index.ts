import type { Auth0Client } from '@auth0/auth0-spa-js';

import * as config from './config';

export { config };

export interface User {
  name?: string;
  given_name?: string;
  family_name?: string;
  orcid?: string;
}

export type Auth0 = {
  isAuthenticated?: boolean;
  user?: User;
  loading: boolean;
  popupOpen: boolean;
  handleRedirectCallback: () => Promise<void>;
} & Pick<
  Auth0Client,
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'loginWithPopup'
  | 'getTokenSilently'
  | 'getTokenWithPopup'
  | 'logout'
>;
