import { Auth0, User } from '@asap-hub/auth';
import { createContext, useContext } from 'react';

const auth0ClientNotProvided = (): never => {
  throw new Error('Auth0 client not provided');
};
const auth0Context = {
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
};
export const tAuth0Context = <T = User>() =>
  createContext<Auth0<T>>(auth0Context);
export const useAuth0 = <T = User>(): Auth0<T> =>
  useContext(getAuth0Context<T>());
