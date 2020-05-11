import React from 'react';

import { useAuth0 } from './react-auth0-spa';

const LoginLogoutButton = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Log in / Register</button>
      )}

      {isAuthenticated && (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out{user && ` ${user.name}`}
        </button>
      )}
    </div>
  );
};

export default LoginLogoutButton;
