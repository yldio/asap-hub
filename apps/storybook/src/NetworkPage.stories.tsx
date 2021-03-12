import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { text, select } from '@storybook/addon-knobs';
import { network } from '@asap-hub/routing';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Network / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = select(
    'Active Tab',
    { Users: 'users', Teams: 'teams', Groups: 'groups' },
    'users',
  );
  const routes = {
    users: network({}).users({}).$,
    teams: network({}).teams({}).$,
    groups: network({}).groups({}).$,
  };
  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <NetworkPage
        page={activeTab}
        usersHref={routes.users}
        teamsHref={routes.teams}
        groupsHref={routes.groups}
        searchQuery={text('Search Query', '')}
      />
    </StaticRouter>
  );
};
