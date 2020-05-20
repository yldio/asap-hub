import React from 'react';

import { useAuth0 } from '@asap-hub/react-context';

const LoginLogoutButton = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Log in / Register</button>
      )}

      {isAuthenticated && (
        <button
          onClick={() =>
            logout({
              // We can assume a DOM environment and thus that location is present in a click handler
              returnTo: globalThis.location.origin,
            })
          }
        >
          Log out{user && ` ${user.name}`}
        </button>
      )}
    </div>
  );
};

export default LoginLogoutButton;
