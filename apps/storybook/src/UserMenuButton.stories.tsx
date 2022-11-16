import { authTestUtils, UserMenuButton } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Navigation / User Menu Button',
  component: UserMenuButton,
};

export const Normal = () => (
  <authTestUtils.UserAuth0Provider>
    <authTestUtils.UserLoggedIn
      user={{
        displayName: text('Display Name', 'Randy Schekman'),
        firstName: text('First Name', 'Randy'),
        lastName: text('Last Name', 'Schekman'),
        avatarUrl: text(
          'Avatar URL',
          'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
        ),
      }}
    >
      <UserMenuButton open={boolean('Open', false)} />
    </authTestUtils.UserLoggedIn>
  </authTestUtils.UserAuth0Provider>
);
export const UserUnknown = () => (
  <UserMenuButton open={boolean('Open', false)} />
);
