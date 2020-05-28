import React from 'react';

import { text } from '@storybook/addon-knobs';
import { LoginLogoutButton } from '@asap-hub/react-components';
import { Auth0Context, useAuth0 } from '@asap-hub/react-context';

export default { title: 'Organisms / Auth / Login and Logout Button' };

export const LoggedOut = () => <LoginLogoutButton />;
export const LoggedIn = () => {
  const auth0Ctx = useAuth0();
  return (
    <Auth0Context.Provider
      value={{
        ...auth0Ctx,
        isAuthenticated: true,
        user: { name: text('Name of the current user', 'John Doe') },
      }}
    >
      <LoginLogoutButton />
    </Auth0Context.Provider>
  );
};
