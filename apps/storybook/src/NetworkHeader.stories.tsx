import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { NetworkPageHeader } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

import { NoPaddingDecorator } from './layout';
import { makeFlagDecorator } from './flags';

export default {
  title: 'Templates / Network / Header',
  decorators: [
    NoPaddingDecorator,
    makeFlagDecorator('Groups Enabled', 'GROUPS'),
  ],
};

export const Normal = () => {
  const page = select(
    'Page',
    { Teams: 'teams', People: 'users', Groups: 'groups' },
    'users',
  );

  return (
    <StaticRouter key={page} location={`/${page}`}>
      <NetworkPageHeader
        page={page}
        usersHref="/users"
        teamsHref="/teams"
        groupsHref="/groups"
        searchQuery={text('Search Query', '')}
        onChangeSearch={() => action('search change')}
      />
    </StaticRouter>
  );
};
