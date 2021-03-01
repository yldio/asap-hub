import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { NetworkPage } from '@asap-hub/react-components';
import { text, select } from '@storybook/addon-knobs';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Network / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const page = select(
    'Active Tab',
    { Users: 'users', Teams: 'teams', Groups: 'groups' },
    'users',
  );
  return (
    <StaticRouter key={page} location={`/${page}`}>
      <NetworkPage
        page={page}
        usersHref="/users"
        teamsHref="/teams"
        groupsHref="/groups"
        searchQuery={text('Search Query', '')}
      />
    </StaticRouter>
  );
};
