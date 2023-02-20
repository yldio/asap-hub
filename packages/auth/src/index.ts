import type { UserMetadataResponse, UserResponse } from '@asap-hub/model';
import type { Auth0Client, GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
import auth0PubKeys from './pubKeys';

export * as gp2 from './gp2';
export { auth0PubKeys };

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
  | 'workingGroups'
> & {
  teams: ReadonlyArray<UserResponse['teams'][0]>;
};

export interface Auth0User<T = User> {
  readonly sub: string;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
  readonly aud: string;
  readonly [customUserClaim: string]: string | undefined | T;
}

export interface Auth0IdToken {
  readonly sub: string;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
  readonly aud: string[];
}

export type Auth0<T = User> = {
  readonly isAuthenticated?: boolean;
  readonly user?: Auth0User<T>;
  readonly loading: boolean;
  readonly popupOpen: boolean;
  readonly refreshUser: () => Promise<void>;
  readonly checkSession?: () => Promise<void>;
  readonly getTokenSilently: (
    options?: GetTokenSilentlyOptions,
  ) => Promise<string>;
} & Pick<
  Auth0Client,
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'loginWithPopup'
  | 'handleRedirectCallback'
  | 'getTokenWithPopup'
  | 'logout'
>;
