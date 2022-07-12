import { createContext, useContext } from 'react';
import { Auth0 } from '@asap-hub/auth';

const auth0ClientNotProvided = (): never => {
  throw new Error('Auth0 client not provided');
};
export const Auth0Context = createContext<Auth0>({
  loading: true,
  popupOpen: false,
  handleRedirectCallback: auth0ClientNotProvided,
  getIdTokenClaims: auth0ClientNotProvided,
  loginWithRedirect: auth0ClientNotProvided,
  loginWithPopup: auth0ClientNotProvided,
  getTokenSilently: auth0ClientNotProvided,
  getTokenWithPopup: auth0ClientNotProvided,
  logout: auth0ClientNotProvided,
  refreshUser: auth0ClientNotProvided,
});
export const useAuth0 = (): Auth0 => useContext(Auth0Context);
