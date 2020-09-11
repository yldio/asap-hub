import React from 'react';

import { useAuth0, useCurrentUser } from '@asap-hub/react-context';
import { Button } from '../../atoms';

const LoginLogoutButton: React.FC<{}> = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const user = useCurrentUser();

  return (
    <div>
      {!isAuthenticated && (
        <Button primary onClick={() => loginWithRedirect()}>
          Log in
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
          Log out{user && ` ${user.displayName}`}
        </Button>
      )}
    </div>
  );
};

export default LoginLogoutButton;
