import React from 'react';

import { RedirectLoginResult } from '@auth0/auth0-spa-js';
import { Auth0Provider } from './react-auth0-spa';
import { domain, clientId } from './config';
import history from '../history';

// Copied from the Auth0 React quickstart
/* istanbul ignore file */

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: RedirectLoginResult['appState']) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Auth0Provider
      domain={domain}
      client_id={clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
