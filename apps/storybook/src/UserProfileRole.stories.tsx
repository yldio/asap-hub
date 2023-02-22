import { ComponentProps } from 'react';
import { select, text } from '@storybook/addon-knobs';
import { UserProfileRole } from '@asap-hub/react-components';

import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / User Profile / Role',
  decorators: [UserProfileDecorator],
};

const props = (): ComponentProps<typeof UserProfileRole> => ({
  firstName: text('First Name', 'Daniel'),
  researchInterests: text('Research Interests', 'My research Interests'),
  responsibilities: text('Responsibilities', 'My responsibilities'),
  reachOut: text('Reach Out', 'You need help setting up your profile'),
  role: select('ASAP Hub Role', ['Staff', 'Grantee', 'Guest'], 'Grantee'),
});

export const Normal = () => <UserProfileRole {...props()} />;
