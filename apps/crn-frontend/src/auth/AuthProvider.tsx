import { RedirectLoginResult } from '@auth0/auth0-spa-js';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config';

import history from '../history';
import { Auth0Provider } from './react-auth0-spa';

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

const audience = 'https://dev.hub.asap.science';

const AuthProvider: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    client_id={AUTH0_CLIENT_ID}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    cacheLocation="localstorage"
    audience={audience}
    useRefreshTokens
  >
    {children}
  </Auth0Provider>
);

export default AuthProvider;
