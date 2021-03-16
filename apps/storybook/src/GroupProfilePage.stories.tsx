import React from 'react';
import { GroupProfilePage } from '@asap-hub/react-components';
import { text, number, date, select } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';
import { network } from '@asap-hub/routing';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Group Profile / Page',
  component: GroupProfilePage,
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const route = network({}).groups({}).group({ groupId: '42' });
  const activeTab = select(
    'Active Tab',
    {
      About: route.about({}).$,
      Calendar: route.calendar({}).$,
      Upcoming: route.upcoming({}).$,
      Past: route.past({}).$,
    },
    route.about({}).$,
  );
  return (
    <StaticRouter key={activeTab} location={activeTab}>
      <GroupProfilePage
        id="42"
        name={text('Name', 'My Group')}
        numberOfTeams={number('Number of Teams', 5)}
        groupTeamsHref="#"
        lastModifiedDate={new Date(date('Last update')).toISOString()}
      />
    </StaticRouter>
  );
};
