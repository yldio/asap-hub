import React from 'react';
import { GroupProfileHeader } from '@asap-hub/react-components';
import { text, number, date, select } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Group Profile / Header',
  component: GroupProfileHeader,
};

export const Normal = () => {
  const activeTab = select('Active Tab', ['About', 'Calendar'], 'About');
  return (
    <StaticRouter key={activeTab} location={`/${activeTab}`}>
      <GroupProfileHeader
        name={text('Name', 'My Group')}
        numberOfTeams={number('Number of Teams', 5)}
        groupTeamsHref="#"
        lastModifiedDate={new Date(date('Last update')).toISOString()}
        aboutHref="/About"
        calendarHref="/Calendar"
      />
    </StaticRouter>
  );
};
