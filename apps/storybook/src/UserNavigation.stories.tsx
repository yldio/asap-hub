import { StaticRouter } from 'react-router-dom';
import { array, select } from '@storybook/addon-knobs';
import { UserNavigation } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Navigation / User Nav',
  component: UserNavigation,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => {
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
  return (
    <StaticRouter key={path} location={path}>
      <UserNavigation
        userProfileHref="/profile"
        teams={array('Teams', ['Team 1', 'Team 2']).map((name, i) => ({
          name,
          href: `/team-${i + 1}`,
        }))}
        aboutHref="/about"
      />
    </StaticRouter>
  );
};
