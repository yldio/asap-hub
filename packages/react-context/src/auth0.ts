import { Auth0, gp2, User } from '@asap-hub/auth';
import { createContext, useContext } from 'react';

const auth0ClientNotProvided = (): never => {
  throw new Error('Auth0 client not provided');
};
export const auth0Context = {
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
export const Auth0Context = createContext<Auth0<User>>(auth0Context);
export const useAuth0 = (): Auth0<User> => useContext(Auth0Context);
export const Auth0ContextGP2 = createContext<Auth0<gp2.User>>(auth0Context);
export const useAuth0GP2 = (): Auth0<gp2.User> => useContext(Auth0ContextGP2);
