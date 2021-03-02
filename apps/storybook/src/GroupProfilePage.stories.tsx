import React from 'react';
import { GroupProfilePage } from '@asap-hub/react-components';
import { text, number, date, select } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Group Profile / Page',
  component: GroupProfilePage,
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = select(
    'Active Tab',
    ['About', 'Calendar', 'Upcoming', 'Past'],
    'About',
  );
  return (
    <StaticRouter key={activeTab} location={`/${activeTab}`}>
      <GroupProfilePage
        name={text('Name', 'My Group')}
        numberOfTeams={number('Number of Teams', 5)}
        groupTeamsHref="#"
        lastModifiedDate={new Date(date('Last update')).toISOString()}
        aboutHref="/About"
        calendarHref="/Calendar"
        upcomingHref="/Upcoming"
        pastHref="/Past"
      />
    </StaticRouter>
  );
};
