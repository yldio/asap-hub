import { RedirectLoginResult } from '@auth0/auth0-spa-js';
import { config } from '@asap-hub/auth';

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

const AuthProvider: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientID}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    cacheLocation="localstorage"
    useRefreshTokens
  >
    {children}
  </Auth0Provider>
);

export default AuthProvider;
