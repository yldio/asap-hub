import React from 'react';

import { text } from '@storybook/addon-knobs';
import { LoginLogoutButton, authTestUtils } from '@asap-hub/react-components';

export default { title: 'Organisms / Auth / Login and Logout Button' };

export const LoggedOut = () => <LoginLogoutButton />;
export const LoggedIn = () => {
  return (
    <authTestUtils.LoggedIn
      user={{
        sub: '42',
        name: text('Name of the current user', 'John Doe'),
      }}
    >
      <LoginLogoutButton />
    </authTestUtils.LoggedIn>
  );
};
