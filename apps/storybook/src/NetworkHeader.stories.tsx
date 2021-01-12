import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { NetworkPageHeader } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / Network / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => {
  const page = select('Page', { Teams: 'teams', Users: 'users' }, 'teams');

  return (
    <StaticRouter key={page} location={`/${page}`}>
      <NetworkPageHeader
        page={page}
        usersHref="/users"
        teamsHref="/teams"
        searchQuery={text('Search Query', '')}
        onChangeSearch={() => action('search change')}
      />
    </StaticRouter>
  );
};
