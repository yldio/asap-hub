import { StaticRouter } from 'react-router-dom';
import { select } from '@storybook/addon-knobs';
import { UserNavigation } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Navigation / User Nav',
  component: UserNavigation,
  decorators: [NoPaddingDecorator],
};

const teams = ['Team 1', 'Team 2'].map((name, i) => ({
  name,
  href: `/team-${i + 1}`,
}));

const path = `/${select(
  'Active Section',
  {
    Profile: 'profile',
    'First Team': 'team-1',
    Settings: 'settings',
    Feedback: 'feedback',
    None: 'none',
  },
  'profile',
)}`;

export const Normal = () => (
  <StaticRouter key={path} location={path}>
    <UserNavigation
      userOnboarded={true}
      userProfileHref="/profile"
      teams={teams}
      workingGroups={[
        { name: 'wg 1', href: '/working-group-1', active: true },
        { name: 'wg 2', href: '/working-group-2', active: false },
      ]}
      aboutHref="/about"
    />
  </StaticRouter>
);

export const Disabled = () => (
  <StaticRouter key={path} location={path}>
    <UserNavigation
      userOnboarded={false}
      userProfileHref="/profile"
      teams={teams}
      workingGroups={[
        { name: 'wg 1', href: '/working-group-1', active: true },
        { name: 'wg 2', href: '/working-group-2', active: false },
      ]}
      aboutHref="/about"
    />
  </StaticRouter>
);
