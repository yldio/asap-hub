import React from 'react';

import { useAuth0 } from '@asap-hub/react-context';
import { Button } from '../../atoms';

const LoginLogoutButton = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <Button primary onClick={() => loginWithRedirect()}>
          Log in / Register
        </Button>
      )}

      {isAuthenticated && (
        <Button
          primary
          onClick={() =>
            logout({
              // We can assume a DOM environment and thus that location is present in a click handler
              returnTo: globalThis.location.origin,
            })
          }
        >
          Log out{user && ` ${user.name}`}
        </Button>
      )}
    </div>
  );
};

export default LoginLogoutButton;
